
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoadingProps {
  fullScreen?: boolean;
  size?: number;
}

export default function Loading({ fullScreen = true, size = 450 }: LoadingProps) {
  const wrapperClass = fullScreen
    ? "flex justify-center items-center h-screen"
    : "flex justify-center items-center";

  return (
    <div className={wrapperClass}>
      <DotLottieReact
        src="https://lottie.host/3735ee78-34d9-4384-9e5d-c3d85f523ed2/qL80hGy8lE.lottie"
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </div>
  );
}
