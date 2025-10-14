import NoteSearch from "../../components/Note/NoteSearch";
import NoteList from "../../components/Note/NoteList";
import TeamNavigate from "../../components/TeamNavigate";
import TeamFileSkeleton from "../../shared/ui/Skeleton/TeamFileSkeleton";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import NoteInput from "../../components/Note/NoteInput";
import DetailedNote from "../../components/Note/DetailedNote";

const TeamNotePage = () => {
  const [showInput, setShowInput] = useState(false);
  const [sort, setSort] = useState(false);
  const [mq, setMq] = useState("");
  const useDebouncedValue = useDebounce(mq, 500);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <TeamFileSkeleton />;
  }

  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex mt-5">
        <TeamNavigate state="note" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <NoteSearch
          setSearchValue={setMq}
          setSort={setSort}
          setShowInput={setShowInput}
          showInput={showInput}
        />
        <div className="flex gap-5 w-full">
          <div className="flex-1 h-[calc(70vh-56px)]">
            <NoteList
              searchValue={useDebouncedValue}
              sort={sort}
              setSelectedId={setSelectedId}
              setShowInput={setShowInput}
            />
          </div>
          <div className="flex-1 h-[calc(70vh-56px)]">
            {showInput ? (
              <NoteInput onAdd={() => {}} noteListRefetch={() => {}} />
            ) : selectedId ? (
              <DetailedNote noteId={selectedId} setShowInput={setShowInput} />
            ) : (
              <div className="bg-white rounded-[8px] px-5 h-full flex items-center justify-center">
                No selected note
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamNotePage;
