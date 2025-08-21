import Profile from "../components/My/Profile";
import Security from "../components/My/Security";
import { useQuery } from "@tanstack/react-query";
import { GetMemberInfo } from "../shared/api/Member/get_delete";

const MyPage = () => {
  const { data } = useQuery({
    queryKey: ["memberInfo"],
    queryFn: GetMemberInfo,
  });

  return (
    <div className="w-full m-[30px] p-[25px] flex flex-col gap-[30px] bg-white rounded-[8px] border border-[#E0E0E0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)] overflow-auto">
      <Profile
        name={data?.result.name}
        profile={data?.result.profileImageObjectKey}
      />
      <Security email={data?.result.email} />
    </div>
  );
};

export default MyPage;
