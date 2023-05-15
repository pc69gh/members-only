import { MinusSmallIcon, XMarkIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Button,
  MenuList,
  MenuListItem,
  Window,
  WindowContent,
  WindowHeader,
} from 'react95';

import { useChatSubscribe } from '@/hooks/useChatSubscribe';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useSetEmoji } from '@/hooks/useSetEmoji';
import { useUploadAttachment } from '@/hooks/useUploadAttachment';

import { ChatWindow } from '@/components/chat/ChatWindow';
import UploadAttachmentButton from '@/components/chat/UploadAttachmentButton';
import { useMenuContext } from '@/components/context/Menu';

export const Chat = ({
  type,
  auth0Token,
}: {
  type: string;
  auth0Token: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [emoteOpen, setEmoteOpen] = useState(false);

  const bucket = `${type}_attachments`;

  const { uploadAttachment, uploading, attachment } =
    useUploadAttachment(bucket);
  const sendMessage = useSendMessage(inputRef, type, attachment);

  const { chatVisible, setChatVisible, setChatRunning } = useMenuContext();
  const { rows } = useChatSubscribe(type, auth0Token);
  const setEmoji = useSetEmoji(inputRef);

  const toggleEmote = useCallback(() => {
    setEmoteOpen((prev) => !prev);
  }, []);

  const addEmoji = useCallback(
    (emoji: string) => {
      setEmoji(emoji);
      toggleEmote();
    },
    [setEmoji, toggleEmote]
  );

  return (
    <div
      className={classNames({
        hidden: !chatVisible,
      })}
    >
      <Draggable defaultPosition={{ x: 0, y: 0 }} handle='.window-title '>
        <Window className='window resize' shadow>
          <WindowHeader className='window-title flex justify-between'>
            <span>Bread Chat.exe</span>
            <div className='flex space-x-1'>
              <Button size='sm' onClick={() => setChatVisible(false)}>
                <MinusSmallIcon className='h-5 w-5' />
              </Button>
              <Button size='sm' onClick={() => setChatRunning(false)}>
                <XMarkIcon className='h-5 w-5' />
              </Button>
            </div>
          </WindowHeader>

          <WindowContent className='flex h-[80vh] w-screen flex-col sm:w-[600px]'>
            <ChatWindow messages={rows} bucket={bucket} className='grow' />
            <form
              className='mt-2 flex h-8 grow-0 space-x-2'
              onSubmit={sendMessage}
            >
              <input ref={inputRef} className='shadow-win95 w-full px-2' />
              <Button type='submit'>Send</Button>
              <UploadAttachmentButton
                onUpload={uploadAttachment}
                loading={uploading}
              />
              <div className='relative shrink-0'>
                <Button
                  fullWidth
                  className='w-[30px] p-0'
                  onClick={toggleEmote}
                >
                  <Image
                    src='/images/cig_eyes.png'
                    alt='cig_eyes'
                    width={20}
                    height={20}
                    className='inline-block'
                  />
                </Button>
                {emoteOpen && (
                  <div className='absolute top-10'>
                    <MenuList style={{ width: '40px' }}>
                      {['bread', 'bun'].map((emoji) => (
                        <MenuListItem
                          onClick={() => addEmoji(emoji)}
                          style={{ padding: 0, justifyContent: 'center' }}
                          key={emoji}
                        >
                          <Image
                            src={`/images/${emoji}.png`}
                            alt={emoji}
                            width={20}
                            height={20}
                            className='inline-block cursor-pointer'
                          />
                        </MenuListItem>
                      ))}
                    </MenuList>
                  </div>
                )}
              </div>
            </form>
          </WindowContent>
        </Window>
      </Draggable>
    </div>
  );
};
