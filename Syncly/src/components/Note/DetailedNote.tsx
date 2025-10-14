import Markdown from "react-markdown";
import Icon from "../../shared/ui/Icon";
import { useShowImage } from "../../hooks/useShowImage";
import mockNotes from "./mock/data";
import Button from "../../shared/ui/Button";

interface INoteProps {
  noteId: number;
  setShowInput: (show: boolean) => void;
}

const DetailedNote = ({ noteId, setShowInput }: INoteProps) => {
  const data = mockNotes.find((note) => note.id === noteId);
  const profileImageUrl = useShowImage(data?.user?.profileUrl || null);

  return (
    <div className="flex flex-col w-full h-full" data-color-mode="light">
      <div className="h-[56px] flex items-center gap-5 bg-white rounded-[8px] p-3 border border-[#E0E0E0]">
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
        <p className="text-[16px] font-semibold flex-1 overflow-hidden text-ellipsis">
          {data?.title}
        </p>
        <p className="text-[16px] text-[#828282] pr-[20px]">{data?.date}</p>
        <Button
          colorType="sub"
          iconName="Pen"
          onClick={() => setShowInput(true)}
        />
      </div>

      <div className="h-full bg-white rounded-[8px] px-4 py-3 border border-[#E0E0E0]">
        <Markdown
          components={{
            h1: (props) => (
              <h1 className="text-[20px] font-bold my-2" {...props} />
            ),
            h2: (props) => (
              <h2 className="text-[18px] font-bold my-2" {...props} />
            ),
            p: (props) => <p className="my-2 leading-6" {...props} />,
            ul: (props) => <ul className="list-disc pl-5 my-2" {...props} />,
            ol: (props) => <ol className="list-decimal pl-5 my-2" {...props} />,
            li: (props) => <li className="my-1" {...props} />,
            code: (props) => (
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded" {...props} />
            ),
            blockquote: (props) => (
              <blockquote
                className="border-l-4 border-[#E0E0E0] pl-3 italic text-[#4f4f4f] my-2"
                {...props}
              />
            ),
          }}
        >
          {data?.content || ""}
        </Markdown>
      </div>
    </div>
  );
};

export default DetailedNote;
