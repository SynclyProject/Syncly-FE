import Navigate from "../../components/Navigate";
import URLsList from "../../components/URLs/URLsList";
import Button from "../../shared/ui/Button";
import { useState } from "react";
import MyUrlSkeleton  from "../../shared/ui/Skeleton/MyUrlSkeleton";
import { useEffect } from "react";

const MyURLsPage = () => {
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <MyUrlSkeleton />;
  }

  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex justify-between mt-5">
        <Navigate state="urls" />
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

export default MyURLsPage;
