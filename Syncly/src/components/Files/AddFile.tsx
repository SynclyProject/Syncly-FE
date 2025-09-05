import Icon from "../../shared/ui/Icon";
import { useState } from "react";

const AddFile = ({
  setAddFileModal,
}: {
  setAddFileModal: (boolean: boolean) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | File) => {
    if (e instanceof File) {
      console.log(e);
      return;
    }
    const files = e.target?.files;
    console.log(files);
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
