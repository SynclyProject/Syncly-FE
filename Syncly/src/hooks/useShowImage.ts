import { useEffect, useState } from "react";
import { PostViewCookie } from "../shared/api/S3";

export const useShowImage = (objectKey: string | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      if (!objectKey) {
        setImageUrl(null);
        return;
      }
      try {
        await PostViewCookie({ objectKey });
        if (!isCancelled) {
          setImageUrl(`${import.meta.env.VITE_VIEW_IMAGE_URL}${objectKey}`);
        }
      } catch {
        if (!isCancelled) {
          setImageUrl(null);
        }
      }
    };

    run();
    return () => {
      isCancelled = true;
    };
  }, [objectKey]);

  return imageUrl;
};
