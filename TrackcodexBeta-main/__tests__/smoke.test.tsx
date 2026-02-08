import React from "react";
import { render } from "@testing-library/react";

const SmokeComponent = () => <div>Smoke Test Passed</div>;

describe("Smoke Test", () => {
  it("should configure jest correctly", () => {
    expect(true).toBe(true);
  });

  it("should render component", () => {
    const { getByText } = render(<SmokeComponent />);
    expect(getByText("Smoke Test Passed")).toBeInTheDocument();
  });
});
