import classNames from 'classnames';
import { createRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Message as MessageType } from '@/hooks/useChatSubscribe';
import { crayonAtom, getDrawing } from '@/hooks/useCrayons';

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
  }, [messages?.length, textArea]);

  const [bgPath, setBGPath] = useState<string | null>(null);
  const paint = useRecoilValue(crayonAtom);

  // useEffect(() => {
  //   const drawing = paint || getDrawing();
  //   if (drawing !== null) {
  //     setBGPath(`/images/lawb/lawb${drawing}.png`);
  //   }
  // }, [paint]);

  useEffect(() => {
    const drawing = paint || getDrawing();
    if (drawing !== null) {
      setBGPath(`/images/mixtape/image${drawing}.png`);
    }
  }, [paint]);

  return (
    <div
      ref={textArea}
      className={classNames(
        `shadow-win95 flex h-[70%] flex-col space-y-1 overflow-y-scroll px-3 py-2 ${className} bg-cover bg-center bg-blend-lighten`,
        {
          'bg-white': bgPath === null,
        }
      )}
      style={{
        backgroundImage: `url(${bgPath})`,
      }}
    >
      {messages?.map((message, i) => (
        <div key={i}>
          <Message {...message} bucket={bucket} />
        </div>
      ))}
    </div>
  );
};
