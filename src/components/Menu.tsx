import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useState } from 'react';
import { AppBar, Button, MenuList, MenuListItem, Toolbar } from 'react95';

import { useHasBread } from '@/hooks/useHasBread';

import { useMenuContext } from '@/components/context/Menu';

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const { setChatVisible, chatVisible, chatRunning, setChatRunning } =
    useMenuContext();

  const hasBread = useHasBread();

  return (
    <>
      <AppBar>
        <Toolbar className='space-between'>
          <div className='relative flex space-x-2'>
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
            {chatRunning && (
              <Button
                onClick={() => setChatVisible(!chatVisible)}
                active={chatVisible}
                style={{ fontWeight: 'bold' }}
              >
                <Image
                  src='/images/bread.png'
                  alt='bread'
                  style={{ width: '20px', marginRight: 6 }}
                  width={36}
                  height={25}
                />
                Bread Chat
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {open && (
        <div className='absolute top-12'>
          <MenuList>
            {user && hasBread && (
              <MenuListItem
                onClick={() => {
                  setChatRunning(true);
                  setOpen(false);
                }}
              >
                <Image
                  src='/images/bread.png'
                  alt='bread'
                  style={{ width: '20px', marginRight: 6 }}
                  width={36}
                  height={25}
                />
                Bread Chat
              </MenuListItem>
            )}

            {user ? (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a href='/api/auth/logout'>
                <MenuListItem>Logout</MenuListItem>
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a href='/api/auth/login'>
                <MenuListItem>Login</MenuListItem>
              </a>
            )}
          </MenuList>
        </div>
      )}
    </>
  );
};
