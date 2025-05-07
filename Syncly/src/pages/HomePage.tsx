import Url from "../components/URLs/Url";
import File from "../components/Files/File";

const HomePage = () => {
  return (
    <div>
      <Url state="input" />
      <Url state="url" text="website.net" />
      <File
        type="folder"
        title="textddddddddddddddddddddddddddddddd"
        date="2025.05.05"
      />
    </div>
  );
};

export default HomePage;
