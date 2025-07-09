import Button from "../../shared/ui/Button";

const BottomBar = () => {
  return (
    <div className="w-full flex gap-2 ">
      <Button iconName="Screen" colorType="white" />
      <Button iconName="Headset" colorType="white" />
      <Button iconName="Microphone_on" colorType="white" />
      <input
        className="w-full border border-[#E0E0E0] bg-white rounded-[8px] p-[10px] outline-none"
        placeholder="Enter your Message"
      />
    </div>
  );
};
export default BottomBar;
