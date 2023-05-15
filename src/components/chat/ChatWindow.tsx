import { createRef, useEffect } from 'react';

import { Message as MessageType } from '@/hooks/useChatSubscribe';

import { Message } from '@/components/chat/Message';

export const ChatWindow = ({
  messages,
  bucket,
  className,
}: {
  messages?: MessageType[];
  bucket: string;
  className?: string;
}) => {
  const textArea = createRef<HTMLDivElement>();
  useEffect(() => {
    if (!textArea.current) return;
    textArea.current.scrollTop = textArea.current.scrollHeight;
  }, [messages, textArea]);

  return (
    <div
      ref={textArea}
      className={`shadow-win95 flex h-[70%] flex-col space-y-1 overflow-y-scroll bg-white px-3 py-2 ${className}`}
    >
      {messages?.map((message, i) => (
        <div key={i}>
          <Message {...message} bucket={bucket} />
        </div>
      ))}
    </div>
  );
};
