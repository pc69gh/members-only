import { useUser } from '@auth0/nextjs-auth0/client';
import classNames from 'classnames';
import Image from 'next/image';
import { useMemo } from 'react';

import ChatImage from '@/components/chat/ChatImage';

const emojis = ['bread', 'bun'].join('|');

export const Message = ({
  user,
  message,
  attachment,
  bucket,
}: {
  user: string;
  message: string;
  attachment: string | null;
  bucket: string;
}) => {
  const { user: auth0User, error, isLoading } = useUser();
  const parsed = useMemo(() => {
    if (!message) return null;

    return message
      .replace(new RegExp(`:(${emojis}):`, 'g'), ' :$1: ')
      .match(new RegExp(`(\\s:(${emojis}):\\s)|(\\S+)|(\\s+)`, 'g'))
      ?.map((match, i) => {
        if (new RegExp(`^\\s?:(${emojis}){1}:\\s?$`).test(match)) {
          const emoji = match.match(
            new RegExp(`(?:)(${emojis})(?:)`, 'g')
          )?.[0];

          return (
            <Image
              key={`${user}-${emoji}-${i}`}
              role='img'
              aria-label={match}
              src={`/images/${emoji}.png`}
              alt={emoji ?? ''}
              width={20}
              height={20}
              className='inline-block'
            />
          );
        } else {
          return match;
        }
      });
  }, [message, user]);

  if (isLoading || error) return null;

  return (
    <div className='flex items-end space-x-2 bg-black/70 p-1 text-lime-400'>
      <div
        className={classNames('font-bold leading-5', {
          'text-blue-500': user === auth0User?.nickname,
        })}
      >
        {user}
      </div>
      <div className='flex flex-col space-y-2'>
        <ChatImage url={attachment} size={200} bucket={bucket} />
        {parsed && <div className='flex h-[20px] items-center'>{parsed}</div>}
      </div>
    </div>
  );
};
