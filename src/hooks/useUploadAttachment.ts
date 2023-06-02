import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

export const useUploadAttachment = (bucket: string) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [done, setDone] = useState<boolean>(false);
  const supabase = useSupabaseClient();

  const { user: auth0User } = useAuth0User();

  useEffect(() => {
    if (done) {
      setAttachment(null);
      setDone(false);
    }
  }, [done]);

  const doneHere = useCallback(() => {
    setDone(true);
  }, []);

  const uploadAttachment = useCallback(
    async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
      try {
        setUploading(true);

        if (!event.target.files || event.target.files.length == 0) {
          throw 'You must select an image to upload.';
        }

        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${auth0User?.nickname}${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        setAttachment(null);
        setAttachment(filePath);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert(error.message);
      } finally {
        setUploading(false);
      }
    },
    [auth0User?.nickname, bucket, supabase.storage]
  );

  return { uploadAttachment, uploading, attachment, doneHere };
};
