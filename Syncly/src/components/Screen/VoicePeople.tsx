import Icon from "../../shared/ui/Icon";
import { useMemo } from "react";

const pastelColors = [
  "#FFD1DC", // light pink
  "#FFECB3", // light yellow
  "#C8E6C9", // light green
  "#B3E5FC", // light blue
  "#E1BEE7", // light purple
  "#FFF9C4", // soft lemon
  "#F8BBD0", // pastel rose
  "#D1C4E9", // lavender
  "#F0F4C3", // light lime
  "#B2DFDB", // turquoise
];

const VoicePeople = ({ profile }: { profile: string }) => {
  const bgColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  }, []);
  return (
    <div
      className="min-w-[388px]  min-h-[196px]  flex justify-center items-center rounded-lg"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[100px]">
        <Icon name={profile} rounded={true} />
      </div>
    </div>
  );
};
export default VoicePeople;
