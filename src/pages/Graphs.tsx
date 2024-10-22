import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetchers.ts';
import { Link, useSearchParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { API_URL } from '../../constants';
import { HeroProp, StarshipList } from '../../types';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Hero' },
    position: { x: 200, y: 100 },
  },
];

const initialEdges: Edge[] = [];

const Graphs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const heroId = searchParams.get('heroId');

  const {
    data: heroData,
    error: heroError,
    isLoading: heroLoading,
  } = useSWR<HeroProp>(heroId ? `${API_URL}/people/${heroId}` : null, fetcher);

  const filmIds = heroData?.films.join(',');

  const {
    data: starShipData,
    error: starShipError,
    isLoading: starShipLoading,
  } = useSWR<StarshipList>(
    filmIds
      ? `${API_URL}/starships/?films__in=${filmIds}&pilots=${heroId}`
      : null,
    fetcher
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const calculateVerticalPosition = useCallback(
    (index: number, baseY: number, step: number) => {
      return baseY + index * step;
    },
    []
  );

  const filmNodes = useMemo(() => {
    if (!heroData) return [];
    const baseY = 200;
    const stepY = 150;
    return heroData.films.map((filmId: number, index: number) => ({
      id: `film-${filmId}`,
      key: `film-node-${filmId}`,
      data: { label: `Film ${filmId}` },
      position: { x: 400, y: calculateVerticalPosition(index, baseY, stepY) },
    }));
  }, [heroData, calculateVerticalPosition]);

  const filmEdges = useMemo(() => {
    if (!heroData) return [];
    return heroData.films.map((filmId: number) => ({
      id: `edge-1-${filmId}`,
      source: '1',
      target: `film-${filmId}`,
      key: `edge-1-${filmId}`,
    }));
  }, [heroData]);

  useEffect(() => {
    if (heroData) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === '1'
            ? { ...node, data: { label: `Hero: ${heroData.name}` } }
            : node
        )
      );
      setNodes((nds) => [...nds, ...filmNodes]);
      setEdges((eds) => [...eds, ...filmEdges]);
    }
  }, [heroData, setNodes, setEdges, filmNodes, filmEdges]);

  const starShipNodes = useMemo(() => {
    if (!starShipData) return [];
    const baseY = 200;
    const stepY = 150;
    return starShipData.results.map((starship, index) => ({
      id: `starship-${starship.id}`,
      key: `starship-node-${starship.id}`,
      data: { label: `Starship: ${starship.name}` },
      position: { x: 600, y: calculateVerticalPosition(index, baseY, stepY) },
    }));
  }, [starShipData, calculateVerticalPosition]);

  const starShipEdges = useMemo(() => {
    if (!starShipData || !heroData) return [];
    return starShipData.results.map((starship) => ({
      id: `edge-film-starship-${starship.id}`,
      key: `edge-film-starship-${starship.id}`,
      source: `film-${starship.films[0]}`,
      target: `starship-${starship.id}`,
    }));
  }, [starShipData, heroData]);

  useEffect(() => {
    if (starShipData) {
      setNodes((nds) => [...nds, ...starShipNodes]);
      setEdges((eds) => [...eds, ...starShipEdges]);
    }
  }, [starShipData, setNodes, setEdges, starShipNodes, starShipEdges]);

  if (heroLoading || starShipLoading) return <div>Loading...</div>;
  if (heroError) return <div>Error loading hero data</div>;
  if (starShipError) return <div>Error loading starship data</div>;

  return (
    <div className="w-[100vw] h-[100vh] text-black">
      <Link className={'text-white animate-bounce'} to={'/'}>
        <IoMdArrowRoundBack
          className={'hover:bg-green-500 w-[100px] h-[100px]'}
          fill={'#fff'}
        />
      </Link>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
};

export default Graphs;
