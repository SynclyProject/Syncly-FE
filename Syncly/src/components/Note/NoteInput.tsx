import Icon from "../../shared/ui/Icon";
import Button from "../../shared/ui/Button";

interface INoteInputProps {
  onAdd?: (noteId: number, title: string) => void;
  onCancel?: () => void;
  setTitle: (title: string) => void;
  title: string;
}

const NoteInput = ({ onCancel, setTitle, title }: INoteInputProps) => {
  return (
    <div className="flex flex-col w-full h-full" data-color-mode="light">
      {/* 헤더 */}
      <div className="h-[56px] flex items-center gap-5 bg-white rounded-t-[8px] p-3 border-l border-r border-t border-[#E0E0E0]">
        <div className="w-[24px] h-[24px] rounded-full">
          <Icon name="User_Default" />
        </div>
        <input
          placeholder="노트 제목을 입력하세요"
          className="text-[16px] font-semibold outline-none flex-1 placeholder:text-[#C0C0C0]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 버튼 */}
        <Button colorType="sub" iconName="Close" onClick={onCancel} />
      </div>

      {/* 프리뷰 (선택사항) */}
      <div className="flex-1 bg-white rounded-b-[8px] p-4 border-l border-r border-b border-[#E0E0E0] overflow-auto text-[#828282] text-center flex items-center justify-center">
        <p>새로운 노트를 생성합니다</p>
      </div>
    </div>
  );
};

export default NoteInput;
