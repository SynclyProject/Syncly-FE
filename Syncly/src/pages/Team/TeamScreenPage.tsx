import TeamNavigate from "../../components/TeamNavigate";
import ParticipantsList from "../../components/Screen/ParticipantsList";
import Chatting from "../../components/Screen/Chatting";

const TeamScreenPage = () => {
  return (
    <div className="w-full h-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full h-full flex flex-col my-5 gap-5">
        <TeamNavigate state="screen" />
        <div className="w-full h-full flex flex-col items-center gap-5 bg-[#F7F9FB]">
          <div className="w-full h-full flex justify-between gap-5">
            <ParticipantsList />
            <Chatting />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeamScreenPage;
