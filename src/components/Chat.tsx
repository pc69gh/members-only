import { XMarkIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import Image from 'next/image';
import { createRef, useCallback, useState } from 'react';
import Draggable from 'react-draggable';
import { Button, Toolbar, Window, WindowContent, WindowHeader } from 'react95';

import { useMenuContext } from '@/components/context/Menu';

const CURRENT_USER = 'yeastbeast.eth';

const MESSAGES = [
  {
    user: 'glutenyeee.eth',
    message: "Somebody ate breadgetter's bread lmao",
  },
  {
    user: 'breadgetter.eth',
    message: 'Naw who ate my bread??',
  },
  {
    user: 'yeastbeast.eth',
    message: ':bread: :bread: :bread: :bread: :bread: :bread:',
  },
];

const Message = ({
  user,
  message,
  ...props
}: {
  user: string;
  message: string;
}) => {
  const parsed = message.split(' ').map((word, i) => {
    if (word.startsWith(':') && word.endsWith(':')) {
      const emoji = word.slice(1, -1);
      return (
        <>
          <span key={`${user}-${emoji}-${i}`} role='img' aria-label={emoji}>
            <Image
              src={`/images/${emoji}.png`}
              alt={emoji}
              width={20}
              height={20}
              className='inline-block'
            />
          </span>{' '}
        </>
      );
    }
    return word + ' ';
  });
  return (
    <div className='flex' {...props}>
      <div
        className={classNames('mr-2 font-bold', {
          'text-blue-500': user === CURRENT_USER,
        })}
      >
        {user}
      </div>
      <div>{parsed}</div>
    </div>
  );
};

const ChatWindow = ({
  messages,
}: {
  messages: { user: string; message: string }[];
}) => (
  <div className='shadow-win95 flex h-[400px] flex-col space-y-1 overflow-y-scroll bg-white px-3 py-2'>
    {messages.map((message, i) => (
      <Message key={`${message.user}-${i}-${message.message}`} {...message} />
    ))}
  </div>
);

export const Chat = () => {
  const { chatVisible, setChatVisible } = useMenuContext();
  const inputRef = createRef<HTMLInputElement>();
  const [messages, setMessages] = useState(MESSAGES);
  const sendMessage = useCallback(() => {
    if (!inputRef.current) return;

    const inputTest = inputRef.current.value;
    inputRef.current.value = '';
    setMessages((messages) => [
      ...messages,
      { user: CURRENT_USER, message: inputTest },
    ]);
  }, [inputRef]);
  return (
    <div
      className={classNames({
        hidden: !chatVisible,
      })}
    >
      <Draggable defaultPosition={{ x: 220, y: 150 }}>
        <Window className='window'>
          <WindowHeader className='window-title flex justify-between'>
            <span>Bread Chat.exe</span>
            <Button size='sm' onClick={() => setChatVisible(false)}>
              <XMarkIcon className='h-5 w-5' />
            </Button>
          </WindowHeader>
          <Toolbar>
            <Button variant='menu' size='sm'>
              File
            </Button>
            <Button variant='menu' size='sm'>
              Edit
            </Button>
            <Button variant='menu' size='sm' disabled>
              Save
            </Button>
          </Toolbar>
          <WindowContent className='w-[600px]'>
            <ChatWindow messages={messages} />
            <div className='mt-2 flex'>
              <input ref={inputRef} className='shadow-win95 w-full px-2' />
              <Button className='ml-2' onClick={() => sendMessage()}>
                Send
              </Button>
            </div>
          </WindowContent>
        </Window>
      </Draggable>
    </div>
  );
};
