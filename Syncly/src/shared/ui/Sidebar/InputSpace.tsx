import { useState } from "react";
import Icon from "../Icon";
import { useMutation } from "@tanstack/react-query";
import { PostTeamSpace } from "../../api/WorkSpace";

interface IInputSpaceProps {
  onAdd: (text: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

const InputSpace = ({
  onAdd,
  onCancel,
  initialValue = "",
}: IInputSpaceProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
      postTeamSpaceMutation({ name: inputValue });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
  const handleBlur = () => {
    if (!inputValue.trim()) onCancel();
  };

  const { mutate: postTeamSpaceMutation } = useMutation({
    mutationFn: PostTeamSpace,
    onSuccess: () => {
      console.log("팀 워크스페이스 생성 성공");
      window.location.reload();
      onCancel();
    },
  });

  return (
    <div className="h-[40px] flex items-center px-4 gap-4 rounded-[8px] bg-white">
      <button className="bg-transparent border-none">
        <Icon name="supervised_user_circle_gray" />
      </button>

      <input
        className="flex-1 w-full text-[#828282] focus:outline-none"
        value={inputValue}
        placeholder="text..."
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <button className="bg-transparent border-none">
        <Icon name="Vector_gray" />
      </button>
    </div>
  );
};
export default InputSpace;
