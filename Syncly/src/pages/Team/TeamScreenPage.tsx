import TeamNavigate from "../../components/TeamNavigate";
import ParticipantsList from "../../components/Screen/ParticipantsList";

const TeamScreenPage = () => {
  return (
    <div className="w-full h-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full h-full flex flex-col mt-5 gap-5">
        <TeamNavigate state="screen" />
        <div className="w-full flex flex-col items-center gap-5 bg-[#F7F9FB]">
          <ParticipantsList />
        </div>
      </div>
    </div>
  );
};
export default TeamScreenPage;
