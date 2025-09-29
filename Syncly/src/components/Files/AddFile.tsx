import { useFileContext } from "../../context/FileContext";
import Icon from "../../shared/ui/Icon";
import { useState } from "react";
import {
  PostFilePresignedUrl,
  PostFileUploadConfirm,
} from "../../shared/api/File";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const AddFile = ({
  setAddFileModal,
  type,
}: {
  setAddFileModal: (boolean: boolean) => void;
  type: "my" | "team";
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { folderId } = useFileContext();

  const { personalSpaceId } = useWorkSpaceContext();
  const { id } = useParams();
  const spaceId = type === "my" ? personalSpaceId : Number(id);

  const { mutate: PostFileUploadConfirmMutation } = useMutation({
    mutationFn: PostFileUploadConfirm,
    onSuccess: (response) => {
      console.log("파일 업로드 확인 성공", response);
      //setAddFileModal(false);
    },
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files[0];
    console.log(files);
    setIsDragging(false);

    //드롭된 파일 핸들링
    handleFileChange(files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement> | File
  ) => {
    if (e instanceof File) {
      console.log(e);
      handleFileUpload(e);
      return;
    }

    // 파일 입력을 통한 파일 선택 처리
    const files = e.target?.files;

    if (files && files.length > 0) {
      const file = files[0]; // 첫 번째 파일만 처리
      console.log(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (e: File) => {
    try {
      const response = await PostFilePresignedUrl({
        workspaceId: spaceId,
        folderId: folderId,
        fileName: e.name,
        fileSize: e.size,
      });
      console.log("response", response);

      //s3 업로드 코드 작성
      const s3Response = await axios.put(response.result.presignedUrl, e, {
        headers: {
          "Content-Type": e.type,
        },
      });
      console.log("s3Response", s3Response);

      //파일 업로드 확인
      try {
        const uploadConfirmResponse = PostFileUploadConfirmMutation({
          workspaceId: spaceId,
          fileName: e.name,
          objectKey: response.result.objectKey,
        });
        console.log("uploadConfirmResponse", uploadConfirmResponse);
      } catch (uploadError) {
        console.error("파일 업로드 확인 실패:", uploadError);
        throw uploadError; // 상위 catch 블록으로 에러 전달
      }
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      // 에러 발생 시 모달을 닫지 않음
    }
  };
  return (
    <div className="w-[760px] h-[480px] bg-white flex flex-col gap-8 p-[30px] border border-[#E0E0E0] rounded-[8px]">
      <div className="flex items-center gap-1.5 border-b border-[#828282] py-2">
        <Icon name="insert_drive_file" />
        <p className="flex-1 text-[#828282] text-[20px] font-semibold">
          Upload Files
        </p>
        <button
          className="cursor-pointer"
          onClick={() => setAddFileModal(false)}
        >
          <Icon name="Close" />
        </button>
      </div>
      <div
        className={`w-full h-full flex items-center justify-center border border-dashed border-[#828282] rounded-[8px]
      cursor-pointer ${
        isDragging ? "border-solid border-[#44A257] bg-[#e9e9e9]" : ""
      }`}
        onClick={() => document.getElementById("fileInput")?.click()}
        onDragEnter={handleDragStart}
        onDragLeave={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          multiple
          hidden
          onChange={handleFileChange}
        />
        <Icon name="cloud_upload" />
      </div>
    </div>
  );
};

export default AddFile;
