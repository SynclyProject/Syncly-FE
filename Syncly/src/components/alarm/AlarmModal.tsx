import React from "react";
import Icon from "../../shared/ui/Icon";
import Button from "../../shared/ui/Button";
import AlarmModalCard from "./AlarmModalCard";

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  
}


const AlarmModal = ({ isOpen, onClose }: AlarmModalProps) => {
  if (!isOpen) return null;

const handleAccept = (title: string) => {
  alert(`${title}에 입장했습니다`);
};


  return (
    <div className="fixed top-14 right-3 z-50 bg-white shadow-lg rounded-xl p-4 w-[500px]">
    
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Icon name="Bell"/> Notification</h3>
    
      <hr className="border-t border-gray-200 my-4" />

      <div className="space-y-3">
        <AlarmModalCard
            title="Deep Learning"
            message="팀스페이스에서의 초대"
            onAccept={() => handleAccept("Deep Learning")}
            
        />
        <AlarmModalCard
            title="Deep Learning"
            message="팀스페이스에서의 초대"
            onAccept={() => handleAccept("Deep Learning")}
            
        />
        {/* 다른 알림들도 추가 가능 */}
        </div>
    </div>
  );
};

export default AlarmModal;
