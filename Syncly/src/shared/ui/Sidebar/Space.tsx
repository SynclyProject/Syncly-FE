import { useRef, useState, useEffect } from "react";
import Icon from "../Icon";
import SideModal from "./SideModal";
import { TTeamSpace } from "../../type/teamSpaceType";
import InputSpace from "./InputSpace";

type TSpaceStateProps = {
  state: "my" | "team";
};

interface ISpaceProps extends TSpaceStateProps {
  iconName: string;
  text: string;
  onClick: () => void;
  spaceId?: number;
  setTeams?: React.Dispatch<React.SetStateAction<TTeamSpace[]>>;
}

const Space = ({
  state,
  iconName,
  text,
  onClick,
  spaceId,
  setTeams,
}: ISpaceProps) => {
  const [modalShow, setModalShow] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // const toggleModal = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation();
  //   setModalShow((prevState) => !prevState);
  // };

  const handleTeamNameChange = (text: string) => {
    if (!text.trim()) return;
    if (spaceId && setTeams) {
      setTeams((prev) =>
        prev.map((team) =>
          team.workspaceId === spaceId ? { ...team, text } : team
        )
      );
    }
    setEditTeam(false);
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
          onAdd={handleTeamNameChange}
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
                  {spaceId && setTeams && (
                    <SideModal
                      spaceId={spaceId}
                      setTeams={setTeams}
                      editTeam={editTeam}
                      setEditTeam={setEditTeam}
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
