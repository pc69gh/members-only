import { XMarkIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import Image from 'next/image';
import { useRef } from 'react';
import Draggable from 'react-draggable';
import { Button, Window, WindowContent, WindowHeader } from 'react95';

import { useSendMessage } from '@/hooks/useSendMessage';
import { useSetEmoji } from '@/hooks/useSetEmoji';

import { ChatWindow } from '@/components/chat/ChatWindow';
import { useMenuContext } from '@/components/context/Menu';

export const Chat = ({
  messages,
}: {
  messages: {
    user: string;
    message: string;
  }[];
}) => {
  const { chatVisible, setChatVisible, setChatRunning } = useMenuContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage(inputRef);
  const setEmoji = useSetEmoji(inputRef);

  return (
    <div
      className={classNames({
        hidden: !chatVisible,
      })}
    >
      <Draggable defaultPosition={{ x: 220, y: 150 }} handle='.window-title '>
        <Window className='window'>
          <WindowHeader className='window-title flex justify-between'>
            <span>Bread Chat.exe</span>
            <div className='flex space-x-1'>
              <Button size='sm' onClick={() => setChatVisible(false)}>
                <span className='text-xl'>-</span>
              </Button>
              <Button size='sm' onClick={() => setChatRunning(false)}>
                <XMarkIcon className='h-5 w-5' />
              </Button>
            </div>
          </WindowHeader>

          <WindowContent className='w-[600px]'>
            <ChatWindow messages={messages} />
            <form className='mt-2 flex' onSubmit={sendMessage}>
              <input ref={inputRef} className='shadow-win95 w-full px-2' />
              <Button type='submit' className='ml-2'>
                Send
              </Button>
              <Button
                className='ml-2'
                onClick={() => setEmoji('bread')}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  src='/images/bread.png'
                  alt='bread'
                  width={20}
                  height={20}
                  className='inline-block'
                />
              </Button>
              <Button
                className='ml-2'
                onClick={() => setEmoji('bun')}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  src='/images/bun.png'
                  alt='bun'
                  width={20}
                  height={20}
                  className='inline-block'
                />
              </Button>
            </form>
          </WindowContent>
        </Window>
      </Draggable>
    </div>
  );
};
