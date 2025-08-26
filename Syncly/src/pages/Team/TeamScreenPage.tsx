import TeamNavigate from "../../components/TeamNavigate";
import ParticipantsList from "../../components/Screen/ParticipantsList";
import Chatting from "../../components/Screen/Chatting";
import BottomBar from "../../components/Screen/BottomBar";
import VoiceList from "../../components/Screen/VoiceList";
import { useEffect, useState } from "react";
import {
  useWorkSpaceContext,
  WorkSpaceProvider,
} from "../../context/workSpaceContext";
import { useParams } from "react-router-dom";

const TeamScreenPage = () => {
  const [isVoice, setIsVoice] = useState(false);
  const { setWorkspaceId } = useWorkSpaceContext();
  const { workspaceId } = useParams();
  useEffect(() => {
    if (workspaceId) {
      setWorkspaceId(Number(workspaceId));
    }
  }, [workspaceId, setWorkspaceId]);

  return (
    <WorkSpaceProvider>
      <div className="w-full h-full mx-[74px] flex flex-col items-center gap-5">
        <div className="w-full h-full flex flex-col my-5 gap-5">
          <TeamNavigate state="screen" />
          <div className="w-full h-full flex flex-col items-center gap-5 p-2.5 bg-[#F7F9FB]">
            <div className="w-full h-full flex justify-between items-center gap-5">
              <div
                className={`w-full flex justify-center ${
                  isVoice ? "h-full" : ""
                }`}
              >
                {isVoice ? (
                  <VoiceList setIsVoice={setIsVoice} />
                ) : (
                  <ParticipantsList setIsVoice={setIsVoice} />
                )}
              </div>
              <Chatting />
            </div>
            <BottomBar />
          </div>
        </div>
      </div>
    </WorkSpaceProvider>
  );
};
export default TeamScreenPage;
