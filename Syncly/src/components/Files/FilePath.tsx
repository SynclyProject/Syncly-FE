import Button from "../../shared/ui/Button";

const FilePath = () => {
  return (
    <div className="w-full flex justify-between items-center mt-5">
      <div className="flex items-center gap-[50px]">
        <p className="font-medium text-[32px] overflow-hidden overflow-ellipsis">
          Files
        </p>
      </div>
      <Button colorType="main" iconName="add_circle" />
    </div>
  );
};

export default FilePath;
