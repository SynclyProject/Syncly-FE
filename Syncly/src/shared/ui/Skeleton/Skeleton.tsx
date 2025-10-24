
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export default function Skeleton({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`bg-#DEE4ED dark:bg-[#d8dee7] ${width} ${height} ${rounded} animate-pulse ${className}`}
    />
  );
}
