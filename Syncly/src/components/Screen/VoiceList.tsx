import Button from "../../shared/ui/Button";
import VoicePeople from "./VoicePeople";

const VoiceList = ({
  setIsVoice,
}: {
  setIsVoice: (isVoice: boolean) => void;
}) => {
  return (
    <div className="w-full h-full flex flex-col gap-3 relative">
      <div className="w-full flex justify-between items-center">
        <p className="text-[20px] font-bold">Title</p>
        <Button
          colorType="red"
          iconName="Phone_off"
          onClick={() => setIsVoice(false)}
        />
      </div>
      <div className="w-full h-full grid grid-cols-2 gap-3 justify-center md:grid-cols-1 lg:grid-cols-2">
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
        <VoicePeople profile="userProfile_2" />
      </div>
    </div>
  );
};
export default VoiceList;
