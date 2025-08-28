import Icon from "../../shared/ui/Icon";
import { PatchNickname } from "../../shared/api/Member/patch";
import { useState, useRef } from "react";
import useDebounce from "../../hooks/useDebounce";
import { PostProfile } from "../../shared/api/S3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const Profile = ({
  name,
  profile,
}: {
  name: string;
  profile: string | null;
}) => {
  const [nickname, setNickname] = useState(name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debouncedNickname = useDebounce(nickname, 200);

  const handleNicknameChange = async () => {
    try {
      await PatchNickname({ newName: debouncedNickname });
      console.log("닉네임 변경 성공");
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

      // 파일 크기 제한 (예: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);

      // 여기서 파일을 서버로 전송하거나 추가 처리
      handleProfileUpload(file);
    }
  };

  const handleProfileUpload = async (file: File) => {
    try {
      // PostProfile API 호출
      postProfileMutation(file);
    } catch (error) {
      console.error("프로필 업로드 실패:", error);
    }
  };

  const { mutate: postProfileMutation } = useMutation({
    mutationFn: PostProfile,
    onSuccess: async (data) => {
      try {
        const objKey = data.result.objectKey;
        const uploadUrl = data.result.uploadUrl;
        const file = selectedFile;

        if (file) {
          await axios.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            maxBodyLength: Infinity,
          });

          console.log("프로필 사진 업로드 성공:", {
            fileName: fileName,
            objectKey: objKey,
          });

          alert("프로필 사진이 변경되었습니다.");

          // 성공 후 상태 초기화
          setSelectedFile(null);
          setFileName("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } catch (error) {
        console.error("S3 업로드 실패:", error);
        alert("프로필 사진 업로드에 실패했습니다.");
      }
    },
  });

  const handleProfileChangeClick = () => {
    fileInputRef.current?.click();
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
