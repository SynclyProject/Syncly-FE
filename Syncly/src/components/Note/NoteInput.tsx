import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface INoteInputProps {
  onAdd: (text: string) => void;
  noteListRefetch: () => void;
}

const NoteInput = ({ onAdd, noteListRefetch }: INoteInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="flex flex-col w-full h-full" data-color-mode="light">
      {/* <div className="flex items-center gap-5 bg-white rounded-[8px] p-3 border border-[#E0E0E0]">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="profile"
            className="w-[24px] h-[24px] rounded-full"
          />
        ) : (
          <div className="w-[24px] h-[24px] rounded-full">
            <Icon name="User_Default" />
          </div>
        )}
        <p>{data?.user?.name}</p>
        <p className="text-[16px] font-semibold">{data?.name}</p>
        <p>{data?.date}</p>
      </div> */}
      <MDEditor
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isComposing) {
            onAdd(inputValue);
            noteListRefetch();
          }
        }}
        value={inputValue}
        onChange={(val) => setInputValue(val || "")}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className="w-full flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold outline-none"
        preview="live"
      />
    </div>
  );
};

export default NoteInput;
