import Icon from "../Icon";

const InputSpace = () => {
  return (
    <div className="h-[40px] flex items-center px-4 gap-4 rounded-[8px] bg-white">
      <Icon name="supervised_user_circle_gray" />
      <input className="flex-1 text-[#828282]" />
      <button className="bg-transparent border-none">
        <Icon name="Vector_gray" />
      </button>
    </div>
  );
};
export default InputSpace;
