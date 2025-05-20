import Navigate from "../components/Navigate";
import Button from "../shared/ui/Button";
import FilePath from "../components/Files/FilePath";
import FileSearch from "../components/Files/FileSearch";
import FileList from "../components/Files/FileList";

const MyFilesPage = () => {
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex justify-between mt-5">
        <Navigate state="files" />
        <Button colorType="main" iconName="add_circle" />
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
