import React from "react";
import Icon from "../../shared/ui/Icon";
import Button from "../../shared/ui/Button";

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmModal = ({ isOpen, onClose }: AlarmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-3 z-50 bg-white shadow-lg rounded-xl p-4 w-[500px]">
    
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Icon name="Bell"/> Notification</h3>
    
      <hr className="border-t border-gray-200 my-4" />

      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow">
          <p>
            <span className="font-semibold">Deep Learning</span>{" "}
            팀스페이스에서의 초대
          </p>
          <div className="flex gap-2">
            <Button colorType="sub" className="px-2 py-1 rounded-md">
              수락
            </Button>
            <Button colorType= "white" className=" px-2 py-1 rounded-md">
              거절
            </Button>
          </div>
        </div>
        {/* 여러 알림이 있을 수 있음 */}
      </div>
    </div>
  );
};

export default AlarmModal;
