import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import File from "../components/Files/File";

// File 컴포넌트가 props로 받은 title="test"를 정상적으로 렌더링하고 있는가?
describe("File", () => {
  test("renders a file", () => {
    render(<File type="file" title="test" date="2021-01-01" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
