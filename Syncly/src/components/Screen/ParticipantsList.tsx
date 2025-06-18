import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import People from "./People";

const ParticipantsList = () => {
  return (
    <div className="w-[335px] min-h-[332px] rounded-[10px] bg-white p-[14px] flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 px-3 py-2 items-center rounded-[4px] border border-[#E0E0E0]">
          <Icon name="Sharing" />{" "}
          <p className="text-[16px] font-semibold">Participants</p>
        </div>
        <Button colorType="main" iconName="Phone" />
      </div>
      <div className="p-5 rounded-[4px] border border-[#E0E0E0] h-full">
        <People profile="User_Circle" name="John Doe" />
      </div>
    </div>
  );
};

export default ParticipantsList;
