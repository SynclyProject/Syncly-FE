import Icon from "../../shared/ui/Icon";
import { useState } from "react";

interface IFileInputProps {
  user: string;
  onAdd: (text: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

const FileInput = ({
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
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
  const handleBlur = () => {
    if (!inputValue.trim()) onCancel();
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0]">
      <Icon name="Folder_input" />
      <input
        className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold outline-none"
        placeholder="폴더명"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <p className="text-[#828282]">{today}</p>
      {user && <Icon name={user} />}
      <Icon name="more-horizontal" />
    </div>
  );
};

export default FileInput;
