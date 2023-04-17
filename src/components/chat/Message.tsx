import { useUser } from '@auth0/nextjs-auth0/client';
import classNames from 'classnames';
import Image from 'next/image';
import { useMemo } from 'react';

const emojis = ['bread', 'bun'].join('|');

export const Message = ({
  user,
  message,
}: {
  user: string;
  message: string;
}) => {
  const { user: auth0User, error, isLoading } = useUser();
  const parsed = useMemo(
    () =>
      message
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
        }),
    [message, user]
  );

  if (isLoading || error) return null;

  return (
    <div className='flex h-[20px] items-center space-x-2'>
      {auth0User?.picture && (
        <Image
          role='img'
          src={auth0User?.picture}
          aria-label={`${user} avatar`}
          alt={`${user} avatar`}
          width={20}
          height={20}
          className='inline-block'
        />
      )}
      <div
        className={classNames('font-bold', {
          'text-blue-500': user === auth0User?.nickname,
        })}
      >
        {user}
      </div>
      <div className='flex h-[20px] items-center'>{parsed}</div>
    </div>
  );
};
