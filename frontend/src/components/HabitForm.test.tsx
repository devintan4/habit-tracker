import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HabitForm from "./HabitForm";
import Swal from "sweetalert2";

jest.mock("sweetalert2");
const mockSwal = Swal as jest.Mocked<typeof Swal>;

describe("HabitForm", () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    onSubmit.mockClear();
    mockSwal.fire.mockClear();
    mockSwal.fire.mockResolvedValue({ isConfirmed: true } as any);
  });

  it("menangani error onSubmit", async () => {
    onSubmit.mockRejectedValue(new Error("fail"));

    render(<HabitForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "X" },
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockSwal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Failed to Add Habit" })
      );
    });
  });
});
