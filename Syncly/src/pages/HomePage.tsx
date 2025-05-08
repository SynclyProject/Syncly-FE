import Navigate from "../components/Navigate";
import URLsInput from "../components/URLs/URLsInput";
import Button from "../shared/ui/Button";

const HomePage = () => {
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex justify-between mt-5">
        <Navigate state="urls" />
        <Button colorType="main" iconName="add_circle" />
      </div>
      <URLsInput />
    </div>
  );
};

export default HomePage;
