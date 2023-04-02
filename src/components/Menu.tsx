import Image from 'next/image';
import { useState } from 'react';
import { AppBar, Button, MenuList, MenuListItem, Toolbar } from 'react95';

import { useMenuContext } from '@/components/context/Menu';

export const Menu = () => {
  const [open, setOpen] = useState(false);

  const { setChatVisible } = useMenuContext();

  const handleChatClick = () => {
    setChatVisible(true);
    setOpen(false);
  };

  return (
    <>
      <AppBar>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button
              onClick={() => setOpen(!open)}
              active={open}
              style={{ fontWeight: 'bold' }}
            >
              <Image
                src='/svg/69_logo.svg'
                alt='react95 logo'
                style={{ height: '20px', marginRight: 4 }}
                width={20}
                height={20}
              />
              Start
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      {open && (
        <div className='absolute top-12' onClick={handleChatClick}>
          <MenuList>
            <MenuListItem>
              <Image
                src='/images/bread.png'
                alt='bread'
                style={{ width: '20px', marginRight: 6 }}
                width={36}
                height={25}
              />
              Bread Chat
            </MenuListItem>
          </MenuList>
        </div>
      )}
    </>
  );
};
