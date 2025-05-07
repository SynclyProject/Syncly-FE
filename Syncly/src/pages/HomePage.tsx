import Url from "../components/URLs/Url";

const HomePage = () => {
  return (
    <div>
      <Url state="input" />
      <Url state="url" text="website.net" />
    </div>
  );
};

export default HomePage;
