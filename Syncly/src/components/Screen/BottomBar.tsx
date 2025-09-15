import Button from "../../shared/ui/Button";
import { useLiveKitContext } from "../../context/LiveKitContext";

const BottomBar = ({ isVoice }: { isVoice: boolean }) => {
  const {
    toggleMic,
    toggleScreenSharing,
    toggleCam,
    micEnabled,
    screenSharing,
    camEnabled,
  } = useLiveKitContext();
  return (
    <div className="w-full flex gap-2 ">
      {isVoice ? (
        <>
          <Button
            iconName={screenSharing ? "Screen" : "Screen_off"}
            colorType="white"
            onClick={toggleScreenSharing}
          />
          <Button
            iconName={camEnabled ? "Cam_on" : "Cam_off"}
            colorType="white"
            onClick={toggleCam}
          />
          <Button
            iconName={micEnabled ? "Microphone_on" : "Microphone_off"}
            colorType="white"
            onClick={toggleMic}
          />
        </>
      ) : (
        <></>
      )}

      <input
        className="w-full border border-[#E0E0E0] bg-white rounded-[8px] p-[10px] outline-none"
        placeholder="Enter your Message"
      />
    </div>
  );
};
export default BottomBar;
