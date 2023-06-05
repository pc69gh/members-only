import { useUser } from '@auth0/nextjs-auth0/client';
import classNames from 'classnames';
import Image from 'next/image';
import { useMemo } from 'react';
import ReactHtmlParser from 'react-html-parser';

import ChatMedia from '@/components/chat/ChatMedia';

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
      .replace(
        // eslint-disable-next-line no-useless-escape
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g,
        '<a target="_blank" href="$1">$1</a>'
      )
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
    <div className='flex items-start space-x-2 bg-black/80 p-1 text-white'>
      <div
        className={classNames('font-bold leading-5', {
          'text-blue-500': user === auth0User?.nickname,
        })}
      >
        {user}
      </div>
      <div className='flex flex-col space-y-2'>
        <ChatMedia url={attachment} size={200} bucket={bucket} />
        {parsed && (
          <div className='flex items-center'>
            {ReactHtmlParser(
              `<div>${parsed.join('') as unknown as string}</div>`
            )}
          </div>
        )}
      </div>
    </div>
  );
};
