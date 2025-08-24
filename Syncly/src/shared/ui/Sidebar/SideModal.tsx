import TeamInviteModel from "../../../components/alarm/TeamInviteModel";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceRole } from "../../../shared/api/WorkSpace/get";
import { DeleteSpace, DeleteSpaceLeave } from "../../api/WorkSpace/delete";
import { useNavigate } from "react-router-dom";

interface ISideModalProps {
  editTeam: boolean;
  setEditTeam: React.Dispatch<React.SetStateAction<boolean>>;
  spaceId: number;
}

const SideModal = ({ editTeam, setEditTeam, spaceId }: ISideModalProps) => {
  const [showInviteModel, setShowInviteModel] = useState(false);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["role", spaceId],
    queryFn: () => GetSpaceRole({ workspaceId: spaceId }),
  });

  const role = data?.result?.role === "MANAGER" ? true : false;

  const handleLeaveClick = async () => {
    try {
      await DeleteSpaceLeave({ workspaceId: spaceId });
      console.log("팀스페이스 나가기 성공");
      window.location.reload();
      navigate("/my-urls");
    } catch (error) {
      console.log("팀스페이스 나가기 실패", error);
    }
  };
  const handleDeleteClick = async () => {
    try {
      await DeleteSpace({ workspaceId: spaceId });
      console.log("팀스페이스 삭제 성공");
      window.location.reload();
      navigate("/my-urls");
    } catch (error) {
      console.log("팀스페이스 삭제 실패", error);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-[210px] rounded-[8px] bg-white p-4 border border-[#E0E0E0]">
      <p className="text-[##828282]" onClick={() => setShowInviteModel(true)}>
        팀원 추가
      </p>
      {showInviteModel && (
        <>
          <div
            //className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowInviteModel(false)}
          />
          <TeamInviteModel
            onClose={() => setShowInviteModel(false)}
            spaceId={spaceId}
          />
        </>
      )}

      {role ? (
        <>
          <p
            className="text-[##828282]"
            onClick={() => {
              setEditTeam(!editTeam);
            }}
          >
            팀스페이스 이름 변경
          </p>
          <p className="text-[#028090]" onClick={handleLeaveClick}>
            팀스페이스 나가기
          </p>
          <p className="text-[#F45B69]" onClick={handleDeleteClick}>
            팀스페이스 삭제
          </p>
        </>
      ) : (
        <p className="text-[#F45B69]" onClick={handleLeaveClick}>
          팀스페이스 나가기
        </p>
      )}
    </div>
  );
};
export default SideModal;
