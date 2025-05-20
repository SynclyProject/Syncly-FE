import Navigate from "../components/Navigate";
import FilePath from "../components/Files/FilePath";
import FileSearch from "../components/Files/FileSearch";
import FileList from "../components/Files/FileList";

const MyFilesPage = () => {
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex mt-5">
        <Navigate state="files" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <FilePath />
        <FileSearch />
        <FileList />
      </div>
    </div>
  );
};

export default MyFilesPage;
