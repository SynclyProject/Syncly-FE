import Button from "../../shared/ui/Button";

interface AlarmModalCardProps {
  title: string;
  message: string;
  onAccept: () => void;
  onDecline: () => void;
}

const AlarmModalCard = ({
  title,
  message,
  onAccept,
  
}: AlarmModalCardProps) => {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-md">
      <p>
        <span className="font-semibold">{title}</span> {message}
      </p>
      <div className="flex gap-2">
        <Button colorType="sub" className="px-2 py-1 rounded-md" onClick={onAccept}>
          수락
        </Button>
        <Button colorType="white" className="px-2 py-1 rounded-md" >
          거절
        </Button>
      </div>
    </div>
  );
};

export default AlarmModalCard;
