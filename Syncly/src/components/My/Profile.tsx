import Icon from "../../shared/ui/Icon";
import { PatchNickname } from "../../shared/api/Member/patch";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";

const Profile = ({
  name,
  profile,
}: {
  name: string;
  profile: string | null;
}) => {
  const [nickname, setNickname] = useState(name);
  const debouncedNickname = useDebounce(nickname, 200);

  const handleNicknameChange = async () => {
    try {
      await PatchNickname({ newName: debouncedNickname });
      console.log("닉네임 변경 성공");
    } catch (error) {
      console.error("닉네임 변경 실패", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[30px]">
      <p className=" pb-4 text-[32px] font-semibold border-b border-b-[#E0E0E0]">
        Mypage
      </p>
      <div className="w-full flex gap-[40px] px-7">
        {profile == null ? (
          <div className="max-w-[190px] max-h-[190px] min-w-[100px] min-h-[100px] flex items-center justify-center">
            <Icon name="User_Default" />
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col justify-center gap-4">
          <p className="text-[24px] text-[#828282]">선호하는 이름</p>
          <input
            className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px] outline-none"
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNicknameChange();
              }
            }}
          />
          <input type="file" id="profile" className="hidden" />
          <p
            className="text-[16px] text-[#456990]"
            onClick={(e) => {
              e.preventDefault();
              const fileInput = document.getElementById(
                "profile"
              ) as HTMLInputElement | null;
              fileInput?.click();
            }}
          >
            프로필 사진 변경
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
