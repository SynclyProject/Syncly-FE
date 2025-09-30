import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

//각각의 테스트 실행 후 가상 DOM을 정리(clean Up)하도록 해줌.
