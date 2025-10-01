import Icon from "../../shared/ui/Icon";
import { useState } from "react";

type TTypeProps = {
  type: "folder" | "image" | "file" | "video";
};
interface IFileInputProps extends TTypeProps {
  user: string | null;
  onAdd: (text: string) => void;
  onCancel: () => void;
  initialValue?: string;
  folderListRefetch: () => void;
}

const FileInput = ({
  type,
  user,
  onAdd,
  onCancel,
  initialValue = "",
}: IFileInputProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
      onCancel(); // 폴더 생성 후 input 숨기기
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
  const handleBlur = () => {
    if (!inputValue.trim()) onCancel();
  };
  const today = new Date().toISOString().split("T")[0];
  const iconName = type + "_gray";

  return (
    <div className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0]">
      <div className="min-w-[24px] min-h-[24px]">
        <Icon name={iconName} />
      </div>

      <input
        className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold outline-none"
        placeholder="폴더명"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <p className="text-[#828282] text-nowrap">{today}</p>
      {!user ? (
        <div className="w-[24px] h-[24px] rounded-full">
          <Icon name="User_Default" />
        </div>
      ) : (
        <img
          src={user ?? undefined}
          alt="profile"
          className="w-[24px] h-[24px] rounded-full"
        />
      )}
      <div className="min-w-[24px] min-h-[24px]">
        <Icon name="more-horizontal" />
      </div>
    </div>
  );
};

export default FileInput;
