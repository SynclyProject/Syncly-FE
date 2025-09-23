import { useEffect, useState } from "react";
import { PostViewCookie } from "../shared/api/S3";

// 동일한 키에 대해 PostViewCookie를 중복 호출하는 것을 방지하기 위한 메모리 캐시
const viewedAtByKey = new Map<string, number>();
const inFlightByKey = new Map<string, Promise<void>>();
const VIEW_COOKIE_TTL_MS = 10 * 60 * 1000; // 10 minutes

//objectKey가 만료되었는지 확인
function shouldRefreshCookie(objectKey: string): boolean {
  const last = viewedAtByKey.get(objectKey);
  if (last == null) return true;
  return Date.now() - last > VIEW_COOKIE_TTL_MS;
}

//objectKey가 만료되었으면 PostViewCookie를 호출
async function ensureViewCookie(objectKey: string): Promise<void> {
  if (!shouldRefreshCookie(objectKey)) return;

  // 이미 같은 키에 대해 요청이 진행 중이면 기존 요청 Promise를 기다려서 중복 호출 방지
  const existing = inFlightByKey.get(objectKey);
  if (existing) {
    await existing;
    return;
  }

  // 성공 시 viewedAtByKey를 현재 시각으로 업데이트 (요청 끝나면 inFlightByKey에서 삭제)
  const promise = (async () => {
    try {
      await PostViewCookie({ objectKey });
      viewedAtByKey.set(objectKey, Date.now());
    } finally {
      inFlightByKey.delete(objectKey);
    }
  })();

  inFlightByKey.set(objectKey, promise);
  await promise;
}

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
        await ensureViewCookie(objectKey);
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
