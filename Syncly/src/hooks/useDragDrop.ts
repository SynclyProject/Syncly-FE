import { useEffect, useRef, useState } from "react";
import { TMySpaceURLs, TUrl } from "../shared/type/mySpaceType";

interface IDataProps {
  urls?: TUrl[];
  urlTapList?: TMySpaceURLs[];
}

const useDragDrop = (data: IDataProps) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [list, setList] = useState<TUrl[] | TMySpaceURLs[]>(
    data.urls || data.urlTapList || []
  );

  // 비동기로 넘어오는 데이터가 갱신되면 내부 리스트 동기화
  useEffect(() => {
    setList((data.urls || data.urlTapList || []) as TUrl[] | TMySpaceURLs[]);
  }, [data.urls, data.urlTapList]);

  //드래그 시작될때 실행
  const dragStart = (e: React.MouseEvent, position: number) => {
    dragItem.current = position;
    console.log((e.target as HTMLElement).innerHTML);
  };

  //드래그 중인 대상이 위로 포개졌을 때

  const dragEnter = (e: React.MouseEvent, position: number) => {
    dragOverItem.current = position;
    console.log((e.target as HTMLElement).innerHTML);
  };
  //드랍 (커서 뗐을 때)
  const drop = () => {
    const newList = [...(list as (TUrl | TMySpaceURLs)[])];
    const dragItemValue = newList[dragItem.current as number];
    newList.splice(dragItem.current as number, 1);
    newList.splice(dragOverItem.current as number, 0, dragItemValue);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(newList as TUrl[] | TMySpaceURLs[]);
  };

  return { dragItem, dragOverItem, dragStart, dragEnter, drop, list };
};

export default useDragDrop;
