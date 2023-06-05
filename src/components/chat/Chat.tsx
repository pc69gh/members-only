import { MinusSmallIcon, XMarkIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Button,
  Frame,
  MenuList,
  MenuListItem,
  Window,
  WindowContent,
  WindowHeader,
} from 'react95';

import { useChatSubscribe } from '@/hooks/useChatSubscribe';
// import { useSetEmoji } from '@/hooks/useSetEmoji';
import { useCrayons } from '@/hooks/useCrayons';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useUploadAttachment } from '@/hooks/useUploadAttachment';

import ChatMedia from '@/components/chat/ChatMedia';
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

  const { uploadAttachment, uploading, attachment, doneHere } =
    useUploadAttachment(bucket);

  const sendIt = useSendMessage({ inputRef, type, attachment });

  const { chatVisible, setChatVisible, setChatRunning } = useMenuContext();
  const { rows } = useChatSubscribe(type, auth0Token);
  // const boilingPot = useSetEmoji(inputRef);
  const getUp = useCrayons();

  const toggleEmote = useCallback(() => {
    setEmoteOpen((prev) => !prev);
  }, []);

  const thisLawb = useCallback(
    (wallArt: number) => {
      getUp(wallArt);
      toggleEmote();
    },
    [getUp, toggleEmote]
  );

  const sendMessage = useCallback(
    (form: React.FormEvent<HTMLFormElement>) => {
      sendIt(form);
      doneHere();
    },
    [doneHere, sendIt]
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
            <span>PC TAPE VOL.1</span>
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
            {attachment && (
              <Frame variant='well' className='p-1'>
                <ChatMedia url={attachment} size={50} bucket={bucket} />
              </Frame>
            )}

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
                    {/* <MenuList style={{ width: '40px' }}>
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
                    </MenuList> */}
                    <MenuList style={{ width: '40px' }}>
                      {[1, 2].map((whichLawb) => (
                        <MenuListItem
                          onClick={() => thisLawb(whichLawb)}
                          style={{ padding: 0, justifyContent: 'center' }}
                          key={whichLawb}
                        >
                          <Image
                            src={`/images/mixtape/image${whichLawb}.png`}
                            alt={`lawb-${whichLawb}`}
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
