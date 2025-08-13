import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import Play from "./Play";
import type { Scenario } from "@/types";

const scenario: Scenario = {
  id: "S1",
  title: "Scenario",
  track_a: "Hit the wall",
  track_b: "Help them",
};

const setAnswers = vi.fn();
const navigate = vi.fn();

vi.mock("@/hooks/useScenarios", () => ({
  useScenarios: () => ({ scenarios: [scenario], loading: false }),
}));
vi.mock("@/hooks/useLocalStorage", () => ({
  useLocalStorage: () => [{}, setAnswers],
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Play flow", () => {
  beforeEach(() => {
    setAnswers.mockClear();
    navigate.mockClear();
  });

  it("handles mouse selections", () => {
    mockMatchMedia(false);
    render(<Play />);
    fireEvent.click(screen.getByLabelText("Choose Track A"));
    expect(setAnswers).toHaveBeenCalledWith({ S1: "A" });
    expect(navigate).toHaveBeenCalledWith("/results");
  });

  it("handles keyboard selections with reduced motion", () => {
    mockMatchMedia(true);
    render(<Play />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(setAnswers).toHaveBeenCalledWith({ S1: "B" });
    expect(navigate).toHaveBeenCalledWith("/results");
  });
});
