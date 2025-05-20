import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";

const FileSearch = () => {
  return (
    <div className="flex items-center gap-[10px] max-w-[600px]">
      <div className="flex items-center gap-[10px] px-3 py-2 border border-[#E0E0E0] rounded-[8px] bg-white">
        <Icon name="search" />
        <input
          className="w-full outline-none"
          type="text"
          placeholder="Search files..."
        />
      </div>
      <Button colorType="white" iconName="filter">
        Filter
      </Button>
      <Button colorType="white" iconName="search" />
    </div>
  );
};

export default FileSearch;
