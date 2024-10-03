import { render, screen } from "@testing-library/react";

import Main from "./Main";
import { describe, expect } from "vitest";
import { TodosContext } from "../contexts/todos";
import userEvent from "@testing-library/user-event";

describe("Main", () => {
  const renderComponent = (state) => {
    const mockDispatch = vi.fn();
    const mockToggleAll = vi.fn();
    const user = userEvent.setup();
    render(
      <TodosContext.Provider
        value={[state, mockDispatch, { toggleAll: mockToggleAll }]}
      >
        <Main />
      </TodosContext.Provider>
    );

    return {
      mockToggleAll,
      toggleAll: screen.getByTestId("toggleAll"),
      toogleLabel: screen.getByLabelText(/mark all as complete/i),
      main: screen.getByTestId("main"),
      todos: screen.queryAllByTestId("todo"),
      user,
    };
  };

  it("should render nothing  when no todos", () => {
    const { toggleAll, toogleLabel, main } = renderComponent({
      todos: [],
      filter: "all",
    });
    expect(toggleAll).toBeInTheDocument();
    expect(toogleLabel).toBeInTheDocument();
    expect(main).toHaveClass("hidden");
  });

  it("should render state when 2 todos exist", () => {
    const { main, todos } = renderComponent({
      todos: [
        { id: 1, text: "test", isCompleted: false },
        { id: 2, text: "test2", isCompleted: false },
      ],
      filter: "all",
    });

    expect(main).not.toHaveClass("hidden");
    expect(todos).toHaveLength(2);
  });

  it("should mark all todos as completed", async () => {
    const { toggleAll, user, mockToggleAll } = renderComponent({
      todos: [
        { id: 1, text: "test", isCompleted: false },
        { id: 2, text: "test2", isCompleted: false },
      ],
      filter: "all",
    });

    await user.click(toggleAll);
    expect(mockToggleAll).toHaveBeenCalledWith(true);
  });
});
