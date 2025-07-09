import TeamNavigate from "../../components/TeamNavigate";
import URLsList from "../../components/URLs/URLsList";
import Button from "../../shared/ui/Button";
import { useState } from "react";

const TeamURLsPage = () => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex justify-between mt-5">
        <TeamNavigate state="urls" />
        <Button
          colorType="main"
          iconName="add_circle"
          onClick={() => setShowInput(true)}
        />
      </div>
      <URLsList showInput={showInput} setShowInput={setShowInput} />
    </div>
  );
};

export default TeamURLsPage;
