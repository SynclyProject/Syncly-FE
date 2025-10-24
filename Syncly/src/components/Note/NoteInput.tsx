import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import mockNotes from "./mock/data";
import { useShowImage } from "../../hooks/useShowImage";
import Icon from "../../shared/ui/Icon";

interface INoteInputProps {
  onAdd: (text: string) => void;
  noteListRefetch: () => void;
  noteId?: number;
}

const NoteInput = ({ onAdd, noteListRefetch, noteId }: INoteInputProps) => {
  const [title, setTitle] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  const data = mockNotes.find((note) => note.id === noteId);
  const profileImageUrl = useShowImage(data?.user?.profileUrl || null);

  console.log("title : ", title);

  return (
    <div className="flex flex-col w-full h-full" data-color-mode="light">
      <div className="h-[56px] flex items-center gap-5 bg-white rounded-t-[8px] p-3 border-l border-r border-t border-[#E0E0E0]">
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
        <input
          className="text-[16px] font-semibold outline-none"
          value={data?.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>{data?.date}</p>
      </div>
      <MDEditor
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isComposing && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onAdd(inputValue);
            noteListRefetch();
          }
          if (!inputValue.trim()) return;
        }}
        value={inputValue}
        onChange={(val) => setInputValue(val || "")}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className="w-full flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold outline-none rounded-[8px]"
        preview="live"
        data-color-mode="light"
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{
          style: {
            fontSize: 16,
            lineHeight: 1.5,
          },
        }}
      />
    </div>
  );
};

export default NoteInput;
