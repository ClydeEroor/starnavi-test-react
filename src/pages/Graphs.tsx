import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetchers.ts';
import { Link, useSearchParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Hero' },
    position: { x: 200, y: 100 }, // Позиция героя
  },
];

const initialEdges: [] = [];

const Graphs = () => {
  const [searchParams] = useSearchParams();
  const heroId = searchParams.get('heroId');

  const { data: heroData, error: heroError } = useSWR(
    `${import.meta.env.VITE_API_URL}/people/${heroId}`,
    fetcher
  );

  const filmIds = heroData?.films.join(',');
  const { data: starShipData, error: starShipError } = useSWR(
    filmIds
      ? `${import.meta.env.VITE_API_URL}/starships/?films__in=${filmIds}&pilots=${heroId}`
      : null,
    fetcher
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: any) => setEdges((eds: any) => addEdge(connection, eds)),
    [setEdges]
  );

  const calculateVerticalPosition = (
    index: number,
    baseY: number,
    step: number
  ) => {
    return baseY + index * step;
  };

  useEffect(() => {
    if (heroData) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === '1'
            ? { ...node, data: { label: `Hero: ${heroData.name}` } }
            : node
        )
      );

      const baseY = 200;
      const stepY = 150;

      const filmNodes = heroData.films.map((filmId: number, index: number) => ({
        id: `film-${filmId}`,
        data: { label: `Film ${filmId}` },
        position: { x: 400, y: calculateVerticalPosition(index, baseY, stepY) },
      }));

      const filmEdges = heroData.films.map((filmId: number) => ({
        id: `edge-1-${filmId}`,
        source: '1',
        target: `film-${filmId}`,
      }));

      setNodes((nds) => [...nds, ...filmNodes]);
      setEdges((eds: any) => [...eds, ...filmEdges]);
    }
  }, [heroData, setNodes, setEdges]);

  useEffect(() => {
    if (starShipData) {
      const baseY = 200;
      const stepY = 150;

      const starShipNodes = starShipData.results.map((starship, index) => ({
        id: `starship-${starship.id}`,
        data: { label: `Starship: ${starship.name}` },
        position: { x: 600, y: calculateVerticalPosition(index, baseY, stepY) },
      }));

      const starShipEdges = starShipData.results.map((starship) => ({
        id: `edge-film-starship-${starship.id}`,
        source: `film-${starship.films[0]}`,
        target: `starship-${starship.id}`,
      }));

      setNodes((nds) => [...nds, ...starShipNodes]);
      setEdges((eds) => [...eds, ...starShipEdges]);
    }
  }, [starShipData, setNodes, setEdges]);

  if (heroError || starShipError) return <div>Error loading data</div>;

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
