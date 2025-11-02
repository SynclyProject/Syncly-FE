import TeamNavigate from "../../components/TeamNavigate";
import ParticipantsList from "../../components/Screen/ParticipantsList";
import Chatting from "../../components/Screen/Chatting";
import BottomBar from "../../components/Screen/BottomBar";
import VoiceList from "../../components/Screen/voiceRoom/VoiceList";
import { useEffect, useState } from "react";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { useParams } from "react-router-dom";
import { LiveKitProvider } from "../../context/LiveKitContext";

const TeamScreenPage = () => {
  const [isVoice, setIsVoice] = useState(false);
  const { setWorkspaceId } = useWorkSpaceContext();
  const { workspaceId } = useParams();
  useEffect(() => {
    if (workspaceId) {
      setWorkspaceId(Number(workspaceId));
    }
  }, [workspaceId, setWorkspaceId]);

  // 페이지 진입 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 추가로 모든 스크롤 가능한 부모 요소도 초기화 (채팅 스크롤은 제외)
      const scrollContainers = document.querySelectorAll(
        '[style*="overflow"], .overflow-y-auto, .overflow-auto'
      );
      scrollContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          // 채팅 컨테이너는 건너뛰기 (border-l-[1px]로 채팅 영역임을 식별)
          if (container.classList.toString().includes("border-l")) {
            return;
          }
          container.scrollTop = 0;
        }
      });
    };

    // 컴포넌트가 완전히 마운트된 후에 실행
    const timeoutId = setTimeout(scrollToTop, 0);

    return () => clearTimeout(timeoutId);
  }, [workspaceId]);

  return (
    <LiveKitProvider>
      <div className="w-full h-full mx-[74px] flex flex-col items-center gap-5">
        <div className="w-full h-full flex flex-col my-5 gap-5">
          <TeamNavigate state="screen" />
          <div className="w-full max-h-[calc(100vh+100px)] flex flex-col items-center gap-5 p-2.5 bg-[#F7F9FB]">
            <div className="w-full h-full flex justify-between items-center gap-5">
              <div
                className={`w-full flex justify-center ${
                  isVoice ? "h-full" : ""
                }`}
              >
                {isVoice ? (
                  <VoiceList setIsVoice={setIsVoice} />
                ) : (
                  <ParticipantsList isVoice={isVoice} setIsVoice={setIsVoice} />
                )}
              </div>
              <div className="min-w-[350px] flex justify-end items-start">
                <Chatting />
              </div>
            </div>
            <BottomBar isVoice={isVoice} />
          </div>
        </div>
      </div>
    </LiveKitProvider>
  );
};
export default TeamScreenPage;
