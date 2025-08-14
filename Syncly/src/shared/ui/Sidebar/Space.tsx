import { useRef, useState, useEffect } from "react";
import Icon from "../Icon";
import SideModal from "./SideModal";
import InputSpace from "./InputSpace";
import { PatchSpaceName } from "../../api/WorkSpace/patch";

type TSpaceStateProps = {
  state: "my" | "team";
};

interface ISpaceProps extends TSpaceStateProps {
  iconName: string;
  text: string;
  onClick: () => void;
  spaceId?: number;
}

const Space = ({ state, iconName, text, onClick, spaceId }: ISpaceProps) => {
  const [modalShow, setModalShow] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // const toggleModal = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation();
  //   setModalShow((prevState) => !prevState);
  // };

  const handleTeamNameChange = async (text: string) => {
    if (!text.trim()) return;
    if (spaceId) {
      //이름 변경 api 추가
      try {
        await PatchSpaceName({ workspaceId: spaceId, name: text });
        console.log("팀스페이스 이름 변경 성공");
        // 이름 변경 성공 후 편집 모드 종료
        setEditTeam(false);
        // 페이지 새로고침으로 목록 업데이트
        window.location.reload();
      } catch (error) {
        console.log("팀스페이스 이름 변경 실패", error);
        // 에러 발생 시에도 편집 모드 종료
        setEditTeam(false);
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalShow(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        modalShow &&
        !modalRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setModalShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalShow]);

  return (
    <>
      {editTeam ? (
        <InputSpace
          onChangeName={handleTeamNameChange}
          onCancel={() => setEditTeam(false)}
          initialValue={text}
        />
      ) : (
        <div
          className="h-[40px] flex items-center px-4 gap-4 rounded-[8px] cursor-pointer bg-white hover:bg-[#DEE4ED]"
          onClick={() => onClick()}
        >
          {state === "my" ? (
            <Icon name={iconName} />
          ) : (
            <Icon name="supervised_user_circle" />
          )}
          <p className="flex-1">{text}</p>
          {state === "team" ? (
            <div className="relative">
              <button
                className="bg-transparent border-none cursor-pointer"
                onClick={handleIconClick}
              >
                <Icon name="Vector" />
              </button>
              {modalShow && (
                <div className="absolute top-[-9px] left-8" ref={modalRef}>
                  {spaceId && (
                    <SideModal
                      editTeam={editTeam}
                      setEditTeam={setEditTeam}
                      spaceId={spaceId}
                    />
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};
export default Space;
