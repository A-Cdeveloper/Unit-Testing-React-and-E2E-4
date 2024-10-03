import { render, screen } from "@testing-library/react";

import Footer from "./Footer";
import { TodosContext } from "../contexts/todos";
import { expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { act } from "react";

describe("Footer", () => {
  const renderComponent = (state, reducerFunction = {}) => {
    const mockDispatch = vi.fn();
    const user = userEvent.setup();
    render(
      <TodosContext.Provider value={[state, mockDispatch, reducerFunction]}>
        <Footer />
      </TodosContext.Provider>
    );
    return {
      footer: screen.getByTestId("footer"),
      todoCount: screen.getByTestId("todoCount"),
      filterLinks: screen.getAllByTestId("filterLink"),
      user,
    };
  };

  it("should render hidden class on initial with no todos", () => {
    const { footer } = renderComponent({ todos: [], filter: "all" });
    expect(footer).toHaveClass("hidden");
  });

  it.each([
    {
      case: "1 todo",
      todos: [{ id: 1, text: "test", isCompleted: false }],
      expected: "1 item left",
    },
    {
      case: "2 todos",
      todos: [
        { id: 1, text: "test", isCompleted: false },
        { id: 2, text: "test2", isCompleted: false },
      ],
      expected: "2 items left",
    },
  ])("should render counter with $case", ({ todos, expected }) => {
    const { footer, todoCount } = renderComponent({
      todos,
      filter: "all",
    });
    expect(footer).not.toHaveClass("hidden");
    expect(todoCount).toHaveTextContent(expected);
  });

  it.each([
    {
      case: "all",
      filter: "all",
    },
    {
      case: "active",
      filter: "active",
    },
    {
      case: "completed",
      filter: "completed",
    },
  ])("should render filter button with $case selected", ({ filter }) => {
    const { filterLinks } = renderComponent({
      todos: [{ id: 1, text: "test", isCompleted: false }],
      filter,
    });

    if (filter === "all") {
      expect(filterLinks[0]).toHaveClass("selected");
    }
    if (filter === "active") {
      expect(filterLinks[1]).toHaveClass("selected");
    }
    if (filter === "completed") {
      expect(filterLinks[2]).toHaveClass("selected");
    }
  });

  it("should change filter", async () => {
    const changeFilterMock = vi.fn();
    const { user, filterLinks } = renderComponent(
      { todos: [], filter: "all" },
      { changeFilter: changeFilterMock }
    );
    await user.click(filterLinks[1]);
    expect(changeFilterMock).toHaveBeenCalledWith("active");
  });
});
