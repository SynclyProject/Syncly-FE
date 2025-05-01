import { TTeamSpace } from "../../type/teamSpaceType";

interface ISideModalProps {
  spaceId: number;
  setTeams: React.Dispatch<React.SetStateAction<TTeamSpace[]>>;
}

const SideModal = ({ spaceId, setTeams }: ISideModalProps) => {
  return (
    <div className="flex flex-col gap-5 w-[210px] rounded-[8px] bg-white p-4 border border-[0.3px] border-[#E0E0E0]">
      <p className="text-[##828282]">팀원 추가</p>
      <p className="text-[##828282]">팀스페이스 이름 변경</p>
      <p
        className="text-[#F45B69]"
        onClick={() => {
          setTeams((prev) => prev.filter((team) => team.id !== spaceId));
        }}
      >
        팀스페이스 나가기
      </p>
    </div>
  );
};
export default SideModal;
