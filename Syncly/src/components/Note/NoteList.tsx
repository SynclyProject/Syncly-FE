// import { useParams } from "react-router-dom";
import Note from "./Note";
import { TNotes } from "../../shared/type/note";
import mockNotes from "./mock/data";

const NoteList = ({
  searchValue,
  sort,
  setSelectedId,
}: {
  searchValue: string;
  sort: boolean;
  setSelectedId: (id: number) => void;
}) => {
  //   const { id } = useParams();
  //   const spaceId = Number(id);

  // const { data: noteList } = useQuery({
  //   queryKey: ["noteList", spaceId],
  //   queryFn: () => GetNoteList({ workspaceId: spaceId }),
  // });

  const filteredNotes = mockNotes.filter((note: TNotes) =>
    note.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const notesToShow = searchValue ? filteredNotes || [] : mockNotes || [];

  const noDataMessage = searchValue
    ? "검색된 노트가 없습니다."
    : "저장한 노트가 없습니다.";

  return (
    <div
      className="flex flex-col w-full h-full bg-white rounded-[8px] px-5"
      style={{ maxHeight: "calc(70vh - 56px)" }}
    >
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="flex-1 text-[16px] font-semibold pl-[20px]">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold pr-[80px]">User</p>
      </div>
      {/* {isPending && (
        //나중에 스켈레톤 UI (컴포넌트 제작) 삽입
        <div className="w-full h-[56px] bg-gray-200 flex items-center gap-[63px] border-t border-t-[#E0E0E0]"></div>
      )} */}
      {sort ? (
        <div className="overflow-y-auto h-full max-h-[calc(70vh-56px)]">
          {[...notesToShow]
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            .map((note: TNotes) => (
              <Note
                key={note.id}
                title={note.name}
                date={note.date}
                user={note.user}
                noteId={note.id}
                setSelectedId={setSelectedId}
              />
            ))}
        </div>
      ) : (
        <div className="overflow-y-auto h-full max-h-[calc(70vh-56px)]">
          {notesToShow.length > 0 ? (
            <>
              {notesToShow.map((note: TNotes) => (
                <Note
                  key={note.id}
                  title={note.name}
                  date={note.date}
                  user={note.user}
                  noteId={note.id}
                  setSelectedId={setSelectedId}
                />
              ))}
            </>
          ) : (
            <p className="h-[56px] flex items-center justify-center text-[16px] font-semibold text-[#828282] border-t border-t-[#E0E0E0]">
              {noDataMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteList;
