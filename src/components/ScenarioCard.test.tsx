import { render, screen, fireEvent } from "@testing-library/react";
import ScenarioCard from "./ScenarioCard";
import type { Scenario } from "@/types";
import { vi } from "vitest";

vi.mock("@/hooks/usePersonas", () => ({
  usePersonas: () => ({ personas: [] })
}));

const scenario: Scenario = {
  id: "S1",
  title: "Test Scenario",
  track_a: "Option A",
  track_b: "Option B",
};

describe("ScenarioCard", () => {
  it("calls onPick for mouse selections", () => {
    const onPick = vi.fn();
    render(<ScenarioCard scenario={scenario} onPick={onPick} />);

    fireEvent.click(screen.getByLabelText("Choose Track A"));
    fireEvent.click(screen.getByLabelText("Choose Track B"));

    expect(onPick).toHaveBeenCalledWith("A");
    expect(onPick).toHaveBeenCalledWith("B");
  });
});
