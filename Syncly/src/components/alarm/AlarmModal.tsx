import Icon from "../../shared/ui/Icon";
import AlarmModalCard from "./AlarmModalCard";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceInvite } from "../../shared/api/WorkSpace/get";
import { TInvite } from "../../shared/type/teamSpaceType";

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmModal = ({ isOpen }: AlarmModalProps) => {
  const { data, refetch } = useQuery({
    queryKey: ["spaceInviteList"],
    queryFn: () => GetSpaceInvite(),
  });

  if (!isOpen) return null;

  const handleAccept = (title: string) => {
    alert(`${title}에 입장했습니다`);
  };

  return (
    <div className="fixed top-14 right-3 z-50 bg-white shadow-lg rounded-xl p-4 w-[500px]">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        <Icon name="Bell" /> Notification
      </h3>

      <hr className="border-t border-gray-200 my-4" />

      <div className="space-y-3">
        {data?.result.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 py-5">알림이 없습니다.</p>
          </div>
        ) : (
          <>
            {data?.result.map((item: TInvite) => (
              <AlarmModalCard
                title={item.workspaceName}
                message="팀스페이스에서의 초대"
                onAccept={() => handleAccept(item.workspaceName)}
                invitationId={item.invitationId}
                refetch={refetch}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;
