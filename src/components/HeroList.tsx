import React, { FC, PropsWithChildren } from 'react';

const HeroList: FC<PropsWithChildren> = ({ children }) => {
  return <div className={'px-5 py-5 flex-col flex'}>{children}</div>;
};

export default HeroList;
