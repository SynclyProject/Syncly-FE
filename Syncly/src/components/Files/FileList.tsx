import FilesData from "../../shared/api/mock/Files";
import File from "./File";
import { TFilesType } from "../../shared/type/FilesType";
// import Icon from "../../shared/ui/Icon";
const FileList = () => {
  return (
    <div className="flex flex-col w-full bg-white rounded-[8px] px-5">
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="text-[16px] font-semibold text-[#828282]">Type</p>
        <p className="flex-1 text-[16px] font-semibold">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold pr-[80px]">User</p>
      </div>
      {FilesData.map((file) => (
        <File
          key={file.id}
          type={file.type as TFilesType}
          title={file.title}
          date={file.date}
          user={file.user}
        />
      ))}
      {/* <table>
        <thead className="h-[56px]">
          <colgroup>
            <col className="w-[70px]" />
            <col className="w-[680px]" />
            <col className="w-[50px]" />
            <col className="w-[130px]" />
            <col className="w-[50px]" />
          </colgroup>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">User</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody className="">
          {FilesData.map((file) => (
            <tr
              key={file.id}
              className=" h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0] hover:cursor-pointer"
            >
              <td>
                <Icon name={file.type} />
              </td>
              <td className="overflow-hidden text-ellipsis text-[16px] font-semibold">
                {file.title}
              </td>
              <td className="text-[#828282]">{file.date}</td>
              <td>
                <Icon name={file.user} />
              </td>
              <td>
                <Icon name="more-horizontal" />
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default FileList;
