import * as React from 'react';

import { InkBlotBG } from '@/components/InkBlotBG';
import { Menu } from '@/components/Menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <>
      <InkBlotBG />
      <Menu />
      <div className='pt-12'>{children}</div>
    </>
  );
}
