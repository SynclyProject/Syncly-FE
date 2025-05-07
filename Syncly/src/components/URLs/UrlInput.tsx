import Icon from "../../shared/ui/Icon";

const UrlInput = () => {
  return (
    <div className="flex w- full bg-white border-t-[#F4F4F4] gap-2">
      <Icon name="url" />
      <input
        className="flex-1 focus:outline-none"
        placeholder="Enter a link..."
      />
      <Icon name="plus_blue" />
    </div>
  );
};

export default UrlInput;
