import NoteSearch from "../../components/Note/NoteSearch";
import NoteList from "../../components/Note/NoteList";
import TeamNavigate from "../../components/TeamNavigate";
import TeamFileSkeleton from "../../shared/ui/Skeleton/TeamFileSkeleton";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import NoteInput from "../../components/Note/NoteInput";

const TeamNotePage = () => {
  const [showInput, setShowInput] = useState(false);
  const [sort, setSort] = useState(false);
  const [mq, setMq] = useState("");
  const useDebouncedValue = useDebounce(mq, 500);
  const [isLoading, setIsLoading] = useState(true);

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
        {showInput ? (
          <NoteInput onAdd={() => {}} noteListRefetch={() => {}} />
        ) : (
          <NoteList searchValue={useDebouncedValue} sort={sort} />
        )}
      </div>
    </div>
  );
};

export default TeamNotePage;
