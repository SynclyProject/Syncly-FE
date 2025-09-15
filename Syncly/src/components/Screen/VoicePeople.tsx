import Icon from "../../shared/ui/Icon";
import { useMemo } from "react";

const pastelColors = [
  "#FFD1DC", // light pink
  "#FFECB3", // light yellow
  "#C8E6C9", // light green
  "#B3E5FC", // light blue
  "#E1BEE7", // light purple
  // "#FFF9C4", // soft lemon
  // "#F8BBD0", // pastel rose
  // "#D1C4E9", // lavender
  // "#F0F4C3", // light lime
  // "#B2DFDB", // turquoise
];

const VoicePeople = ({
  profile,
  onClick,
  size = "small",
}: {
  profile: string;
  onClick: () => void;
  size: "small" | "large" | "default";
}) => {
  // profile을 기반으로 일관된 색상 생성
  const bgColor = useMemo(() => {
    const hash = profile.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return pastelColors[Math.abs(hash) % pastelColors.length];
  }, [profile]);

  const iconSize = {
    small: "w-[70px]",
    large: "w-[150px]",
    default: "w-[100px]",
  };
  const cardHeightSize = {
    small: "h-[150px]",
    large: "h-full",
    default: "h-full",
  };
  return (
    <div
      className={`w-full ${cardHeightSize[size]} flex justify-center items-center rounded-lg cursor-pointer`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className={`${iconSize[size]}`}>
        <Icon name={profile} rounded={true} />
      </div>
    </div>
  );
};
export default VoicePeople;
