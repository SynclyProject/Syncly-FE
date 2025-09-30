import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import FileList from "../components/Files/FileList";

// FileList 컴포넌트에서 mock data를 바탕으로 한 File 컴포넌트들이 정상적으로 렌더링되고 있는가?

//수정해야 함.
describe("FileList", () => {
  test("renders a fileList", () => {
    render(
      <FileList
        searchValue=""
        setShowInput={() => {}}
        showInput={false}
        sort={false}
      />
    );
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
