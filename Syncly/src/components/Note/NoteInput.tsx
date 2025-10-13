import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface INoteInputProps {
  onAdd: (text: string) => void;
  noteListRefetch: () => void;
}

const NoteInput = ({ onAdd, noteListRefetch }: INoteInputProps) => {
  const [title, setTitle] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  return (
    <div className="container flex flex-col" data-color-mode="light">
      <input
        className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold outline-none bg-white pl-[10px] rounded-[8px]"
        placeholder="제목을 입력해주세요..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

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
        preview="edit"
      />

      <div className="mt-3">
        <p className="text-[14px] font-semibold mb-2">Preview</p>
        <MDEditor.Markdown
          source={inputValue}
          style={{ background: "#fff", padding: 12, borderRadius: 8 }}
        />
      </div>
    </div>
  );
};

export default NoteInput;
