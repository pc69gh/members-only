import { createRef, useEffect } from 'react';

import { Message } from '@/components/chat/Message';

export const ChatWindow = ({
  messages,
}: {
  messages?: { user: string; message: string }[];
}) => {
  const textArea = createRef<HTMLDivElement>();
  useEffect(() => {
    if (!textArea.current) return;
    textArea.current.scrollTop = textArea.current.scrollHeight;
  }, [messages, textArea]);

  return (
    <div
      ref={textArea}
      className='shadow-win95 flex h-[400px] flex-col space-y-1 overflow-y-scroll bg-white px-3 py-2'
    >
      {messages?.map((message, i) => (
        <div key={i}>
          <Message {...message} />
        </div>
      ))}
    </div>
  );
};
