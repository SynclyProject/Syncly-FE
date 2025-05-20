import Icon from "../../shared/ui/Icon";

const Profile = () => {
  const name = "김희재";
  return (
    <div className="w-full flex flex-col gap-[30px]">
      <p className=" pb-4 text-[32px] font-semibold border-b border-b-[#E0E0E0]">
        Mypage
      </p>
      <div className="w-full flex gap-[40px] px-7">
        <Icon name="userProfile_2" />
        <div className="flex flex-col justify-center gap-4">
          <p className="text-[24px] text-[#828282]">선호하는 이름</p>
          <input
            className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px]"
            type="text"
            value={name}
          />
          <p className="text-[16px] text-[#456990]">프로필 사진 변경 </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
