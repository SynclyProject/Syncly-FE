import Navigate from "../components/navigate";
import Button from "../shared/ui/Button";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-between">
        <Navigate state="urls" />
        <Button colorType="main" iconName="add_circle" />
      </div>
    </div>
  );
};

export default HomePage;
