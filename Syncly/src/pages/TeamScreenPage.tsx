import TeamNavigate from "../components/TeamNavigate";

const TeamScreenPage = () => {
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex mt-5">
        <TeamNavigate state="screen" />
      </div>
    </div>
  );
};
export default TeamScreenPage;
