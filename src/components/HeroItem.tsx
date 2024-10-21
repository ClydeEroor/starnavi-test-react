import React from 'react';
import { Link } from 'react-router-dom';
const HeroItem = ({ id, name }: { id: number; name: string }) => {
  return (
    <Link className={'hover:text-green-600'} to={`/graphs?heroId=${id}`}>
      {name}
    </Link>
  );
};

export default HeroItem;
