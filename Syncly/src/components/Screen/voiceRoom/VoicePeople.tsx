import Icon from "../../../shared/ui/Icon";
import { useMemo } from "react";
import { Track } from "livekit-client";
import {
  VideoTrack,
  useTrackRefContext,
  isTrackReference,
} from "@livekit/components-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetInitInfo } from "../../../shared/api/Live";
import { TScreenInitInfo } from "../../../shared/type/teamSpaceType";

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
  participantId,
  onClick,
  size = "small",
  showTracks = false,
}: {
  participantId: string;
  onClick: () => void;
  size: "small" | "large" | "default";
  showTracks?: boolean;
}) => {
  const trackRef = useTrackRefContext();

  const { id } = useParams();

  const { data, refetch } = useQuery({
    queryKey: ["live-room-members", id],
    queryFn: () => GetInitInfo({ workspaceId: Number(id) }),
  });
  refetch();

  const participant = data?.result.participants.find(
    (participant: TScreenInitInfo) =>
      participant.participantId === participantId
  );

  // participantId을 기반으로 일관된 색상 생성
  const bgColor = useMemo(() => {
    const hash = participantId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return pastelColors[Math.abs(hash) % pastelColors.length];
  }, [participantId]);

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

  // 트랙이 있고 showTracks가 true일 때 비디오/오디오 트랙 렌더링
  const renderTrack = () => {
    if (!showTracks || !trackRef || !isTrackReference(trackRef)) {
      return null;
    }

    // 화면공유 트랙인 경우
    if (trackRef.source === Track.Source.ScreenShare) {
      return (
        <VideoTrack
          trackRef={trackRef}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }

    // 캠 트랙인 경우 - 전체 컴포넌트를 비디오로 교체
    if (trackRef.source === Track.Source.Camera) {
      return (
        <div className="w-full h-full relative">
          <VideoTrack
            trackRef={trackRef}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      );
    }

    // 오디오 트랙인 경우 (기본 아이콘 표시)
    return null;
  };

  // 캠이 켜져있으면 전체를 비디오로 교체
  const hasCameraTrack =
    showTracks &&
    trackRef &&
    isTrackReference(trackRef) &&
    trackRef.source === Track.Source.Camera;

  const hasScreenTrack =
    showTracks &&
    trackRef &&
    isTrackReference(trackRef) &&
    trackRef.source === Track.Source.ScreenShare;

  if (hasCameraTrack) {
    return (
      <div
        className={`w-full ${cardHeightSize[size]} rounded-lg cursor-pointer relative`}
        onClick={onClick}
      >
        {renderTrack()}
      </div>
    );
  }
  if (hasScreenTrack) {
    return (
      <div
        className={`w-full ${cardHeightSize[size]} rounded-lg cursor-pointer relative`}
        onClick={onClick}
      >
        {renderTrack()}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded z-10 flex items-center gap-2">
          <Icon name="Screen_white" />
          {participant?.participantName}
        </div>
      </div>
    );
  }

  // 기본 아이콘 표시 (캠이 꺼져있거나 트랙이 없을 때)
  return (
    <div
      className={`w-full ${cardHeightSize[size]} flex justify-center items-center rounded-lg cursor-pointer relative`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className={`${iconSize[size]}`}>
        {participant?.profileImageObjectKey == null ? (
          <div className="max-w-[190px] max-h-[190px] min-w-[100px] min-h-[100px] flex items-center justify-center">
            <Icon name="User_Default" />
          </div>
        ) : (
          <img
            src={`${import.meta.env.VITE_IMAGE_URL}/${
              participant?.profileImageObjectKey
            }`}
            alt="profile"
            className="w-[190px] h-[190px] object-cover rounded-full"
          />
        )}
      </div>
      {/* 화면공유 트랙이 있으면 오른쪽 상단에 표시 */}
      {renderTrack()}

      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded z-10">
        {participant?.participantName}
      </div>
    </div>
  );
};
export default VoicePeople;
