import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

const Layout: FC<PropsWithChildren> = () => {
  return (
    <div
      className={
        'bg-black min-h-[100vh] border-[4px] border-violet-600 w-full relative text-white'
      }
    >
      <Outlet />
    </div>
  );
};

export default Layout;
