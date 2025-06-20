import Button from "../../shared/ui/Button";
import VoicePeople from "./VoicePeople";

const VoiceList = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-[20px] font-bold">Title</p>
        <Button colorType="red" iconName="Phone_off" />
      </div>
      <div className="flex flex-wrap gap-3">
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
      </div>
    </div>
  );
};
export default VoiceList;
