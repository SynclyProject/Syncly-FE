import Icon from "../../shared/ui/Icon";

const AddFile = ({
  setAddFileModal,
}: {
  setAddFileModal: (boolean: boolean) => void;
}) => {
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
      <div className="w-full h-full flex items-center justify-center border border-dashed border-[#828282] rounded-[8px]">
        <Icon name="cloud_upload" />
      </div>
    </div>
  );
};

export default AddFile;
