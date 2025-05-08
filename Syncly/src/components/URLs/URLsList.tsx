import URLsListData from "../../shared/api/mock/URLsList";
import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import { useState } from "react";
import URLsInput from "./URLsInput";

const URLsList = () => {
  const [urlsList, setUrlsList] = useState<TMySpaceURLs[]>(URLsListData);
  return (
    <div>
      {!urlsList && <URLsInput />}
      {urlsList && (
        <div>
          {urlsList.map((urls: TMySpaceURLs) => (
            <></>
          ))}
        </div>
      )}
    </div>
  );
};

export default URLsList;
