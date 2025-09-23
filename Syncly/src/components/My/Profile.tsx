import Icon from "../../shared/ui/Icon";
import {
  PatchNickname,
  PatchProfileImage,
} from "../../shared/api/Member/patch";
import { useState, useRef } from "react";
import useDebounce from "../../hooks/useDebounce";
import { PostProfile } from "../../shared/api/S3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useShowImage } from "../../hooks/useShowImage";

const Profile = ({
  name,
  profile,
  refetch,
}: {
  name: string;
  profile: string | null;
  refetch: () => void;
}) => {
  const [nickname, setNickname] = useState(name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  // const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debouncedNickname = useDebounce(nickname, 200);

  const handleNicknameChange = async () => {
    try {
      await PatchNickname({ newName: debouncedNickname });
      console.log("닉네임 변경 성공");
      refetch();
    } catch (error) {
      console.error("닉네임 변경 실패", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 유효성 검사 (이미지 파일만 허용)
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택 가능합니다.");
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);

      // 여기서 파일을 서버로 전송하거나 추가 처리
      handleProfileUpload(file);
    }
  };

  const handleProfileUpload = async (file: File) => {
    // PostProfile API 호출
    postProfileMutation(file);
  };

  const { mutate: postProfileMutation } = useMutation({
    mutationFn: PostProfile,
    onSuccess: async (data) => {
      const objKey = data.result.objectKey;
      const uploadUrl = data.result.uploadUrl;
      const file = selectedFile;

      if (file) {
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        PatchProfileImage({
          fileName: fileName,
          objectKey: objKey,
        });

        // 성공 후 상태 초기화
        setSelectedFile(null);
        setFileName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        refetch();
      }
    },
  });

  const handleProfileChangeClick = () => {
    fileInputRef.current?.click();
  };

  const profileImageUrl = useShowImage(profile || null);

  return (
    <div className="w-full flex flex-col gap-[30px]">
      <p className=" pb-4 text-[32px] font-semibold border-b border-b-[#E0E0E0]">
        Mypage
      </p>
      <div className="w-full flex gap-[40px] px-7">
        {!profileImageUrl ? (
          <div className="max-w-[190px] max-h-[190px] min-w-[100px] min-h-[100px] flex items-center justify-center">
            <Icon name="User_Default" />
          </div>
        ) : (
          <img
            src={profileImageUrl ?? undefined}
            alt="profile"
            className="w-full max-w-[190px] aspect-square object-contain rounded-full"
            onError={() => {
              console.error("이미지 로드 실패, 기본 URL로 폴백");
            }}
          />
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

          {/* 파일 입력 필드 */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          {/* 프로필 사진 변경 버튼 */}
          <p
            className="text-[16px] text-[#456990] cursor-pointer hover:text-[#345678] transition-colors"
            onClick={handleProfileChangeClick}
          >
            프로필 사진 변경
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
