import TeamNavigate from "../../components/TeamNavigate";
import URLsListWithWebSocket from "../../components/URLs/URLsListWithWebSocket";
import Button from "../../shared/ui/Button";
import { useState } from "react";
import { useEffect } from "react";
import TeamUrlSkeleton from "../../shared/ui/Skeleton/TeamUrlSkeleton";

const TeamURLsPage = () => {
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <TeamUrlSkeleton />;
  }

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
      <URLsListWithWebSocket
        showInput={showInput}
        setShowInput={setShowInput}
      />
    </div>
  );
};

export default TeamURLsPage;
