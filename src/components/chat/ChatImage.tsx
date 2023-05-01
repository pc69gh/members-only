import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ChatImage({
  url,
  size,
  bucket,
}: {
  url: string | null;
  size: number;
  bucket: string;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const supabase = useSupabaseClient();

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImageUrl(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error downloading image: ', error.message);
    }
  };

  useEffect(() => {
    if (url) downloadImage(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt='chat image'
      className='avatar image'
      width={size}
      height={size}
    />
  );
}
