
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
      className={`bg-#DEE4ED dark:bg-[#abb9ce] ${width} ${height} ${rounded} animate-pulse ${className}`}
    />
  );
}
