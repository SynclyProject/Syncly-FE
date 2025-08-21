import { useState } from "react";
import { PatchPassword } from "../../shared/api/Member/patch";
import DeleteForm from "./deleteForm";

const Security = ({ email }: { email: string }) => {
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    try {
      await PatchPassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      alert("비밀번호가 변경되었습니다");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("비밀번호 변경 실패", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[15px]">
      <p className="pb-4 text-[24px] font-semibold border-b border-b-[#E0E0E0]">
        계정 보안
      </p>
      <div className="max-w-[400px] flex flex-col justify-center gap-4">
        <p className="text-[20px] text-[#828282]">이메일</p>
        <input
          className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px] outline-none"
          type="text"
          value={email}
        />
      </div>
      <form>
        <div className="max-w-[400px] flex flex-col justify-center gap-4">
          <p className="text-[20px] text-[#828282]">비밀번호</p>
          <input
            className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px] outline-none"
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px] outline-none"
            type="password"
            placeholder="변경 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px] outline-none"
            type="password"
            placeholder="변경 비밀번호 재입력"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </form>

      <div className="flex flex-col gap-1">
        <p
          className="text-[20px] text-[#456990] cursor-pointer"
          onClick={handlePasswordChange}
        >
          비밀번호 변경
        </p>

        {/*계정 삭제 버튼 */}
        <button
          className="block text-left text-[20px] text-[#EB5757]"
          onClick={() => setShowDeleteForm(true)}
        >
          계정 삭제
        </button>

        {/*계정삭제 폼 */}

        {showDeleteForm && <DeleteForm setShowDeleteForm={setShowDeleteForm} />}
      </div>
    </div>
  );
};

export default Security;
