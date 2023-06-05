import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ChatMedia({
  url,
  size,
  bucket,
}: {
  url: string | null;
  size: number;
  bucket: string;
}) {
  const [media, setMedia] = useState<{
    url: string;
    type: string;
  }>();

  const supabase = useSupabaseClient();

  const downloadMedia = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setMedia({
        url,
        type: data.type.split('/')[0],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error downloading image: ', error.message);
    }
  };

  useEffect(() => {
    if (url) downloadMedia(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (!media) return null;

  if (media.type === 'image') {
    return (
      <Image
        src={media.url}
        alt='chat image'
        className='avatar image'
        width={size}
        height={size}
      />
    );
  } else if (media.type === 'video') {
    return (
      <video
        src={media.url}
        className='avatar video'
        width={size}
        height={size}
        controls
      />
    );
  } else if (media.type === 'audio') {
    return <audio src={media.url} className='avatar audio' controls />;
  }

  return null;
}
