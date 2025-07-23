interface AlarmItemProps {
    title: string;
    message: string;
    onAccept: () => void;
    onDecline: () => void;
  }
  
  const AlarmItem = ({ title, message, onAccept, onDecline }: AlarmItemProps) => {
    return (
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-md">
        <p>
          <span className="font-semibold">{title}</span>{" "}
          {message}
        </p>
        <div className="flex gap-2">
          <button className="bg-[#AEBBFF] text-white px-2 py-1 rounded-md" onClick={onAccept}>
            수락
          </button>
          <button className="border px-2 py-1 rounded-md" onClick={onDecline}>
            거절
          </button>
        </div>
      </div>
    );
  };
  
  export default AlarmItem;
  