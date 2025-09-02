import Button from "../../shared/ui/Button";
import { useMutation } from "@tanstack/react-query";
import {
  PostSpaceAccept,
  PostSpaceReject,
} from "../../shared/api/WorkSpace/post";

interface AlarmModalCardProps {
  title: string;
  message: string;
  onAccept: () => void;
  invitationId: number;
  refetch: () => void;
}

const AlarmModalCard = ({
  title,
  message,
  onAccept,
  invitationId,
  refetch,
}: AlarmModalCardProps) => {
  const { mutate: postSpaceAcceptMutation } = useMutation({
    mutationFn: PostSpaceAccept,
    onSuccess: () => {
      refetch();
      onAccept();
    },
  });

  const { mutate: postSpaceRejectMutation } = useMutation({
    mutationFn: PostSpaceReject,
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-md">
      <p>
        <span className="font-semibold text-[#456990]">{title}</span>
        <span className="text-[#456990] ml-1">{message}</span>
      </p>
      <div className="flex gap-2">
        <Button
          colorType="white"
          className="px-2 py-1 rounded-md  text-[#456990] hover:border-gray-400  hover:shadow-md transition-all duration-200"
          onClick={() => postSpaceAcceptMutation({ spaceId: invitationId })}
        >
          수락
        </Button>
        <Button
          colorType="sub"
          className="px-2 py-1 rounded-md hover:border-gray-400 hover:shadow-xl transition-all duration-200"
          onClick={() =>
            postSpaceRejectMutation({ data: { spaceId: invitationId } })
          }
        >
          거절
        </Button>
      </div>
    </div>
  );
};

export default AlarmModalCard;
