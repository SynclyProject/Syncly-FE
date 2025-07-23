import React from "react";
import Icon from "../../shared/ui/Icon";

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmModal = ({ isOpen, onClose }: AlarmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 z-50 bg-white shadow-lg rounded-xl p-4 w-[320px]">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Icon name="Bell"/> Notification</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow">
          <p>
            <span className="font-semibold">Deep Learning</span>{" "}
            팀스페이스에서의 초대
          </p>
          <div className="flex gap-2">
            <button className="bg-[#AEBBFF] text-white px-2 py-1 rounded-md">
              수락
            </button>
            <button className="border border-gray-300 px-2 py-1 rounded-md">
              거절
            </button>
          </div>
        </div>
        {/* 여러 알림이 있을 수 있음 */}
      </div>
    </div>
  );
};

export default AlarmModal;
