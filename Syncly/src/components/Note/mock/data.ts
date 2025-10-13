import { TNotes } from "../../../shared/type/note";

const mockNotes: TNotes[] = [
  {
    id: 1,
    name: "팀 미팅 회의록",
    date: "2025-10-10",
    user: {
      id: 101,
      name: "김민수",
      profileUrl: null,
    },
  },
  {
    id: 2,
    name: "스프린트 계획 초안",
    date: "2025-10-11",
    user: {
      id: 102,
      name: "이서연",
      profileUrl: null,
    },
  },
  {
    id: 3,
    name: "UI 컴포넌트 가이드",
    date: "2025-10-12",
    user: {
      id: 103,
      name: "박진우",
      profileUrl: "",
    },
  },
  {
    id: 4,
    name: "API 스펙 정리",
    date: "2025-10-12",
    user: {
      id: 104,
      name: "최지훈",
      profileUrl: "",
    },
  },
  {
    id: 5,
    name: "릴리즈 체크리스트",
    date: "2025-10-13",
    user: {
      id: 105,
      name: "정하은",
      profileUrl: "",
    },
  },
];

export default mockNotes;
