import Navigate from "../components/Navigate";
import FilePath from "../components/Files/FilePath";
import FileSearch from "../components/Files/FileSearch";
import FileList from "../components/Files/FileList";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";

const MyFilesPage = () => {
  const [showInput, setShowInput] = useState(false);
  const [sort, setSort] = useState(false);
  const [mq, setMq] = useState("");
  const useDebouncedValue = useDebounce(mq, 500);
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex mt-5">
        <Navigate state="files" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <FilePath setShowInput={setShowInput} />
        <FileSearch setSearchValue={setMq} setSort={setSort} />
        <FileList
          searchValue={useDebouncedValue}
          setShowInput={setShowInput}
          showInput={showInput}
          sort={sort}
        />
      </div>
    </div>
  );
};

export default MyFilesPage;
