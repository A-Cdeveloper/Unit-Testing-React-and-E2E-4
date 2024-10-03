import { render, screen } from "@testing-library/react";

import Header from "./Header";
import { TodosContext } from "../contexts/todos";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Header", () => {
  const renderComponent = () => {
    const mockDispatch = vi.fn();
    const mockAddToDo = vi.fn();
    const user = userEvent.setup();
    render(
      <TodosContext.Provider
        value={[{}, mockDispatch, { addTodo: mockAddToDo }]}
      >
        <Header />
      </TodosContext.Provider>
    );
    return {
      mockAddToDo,
      input: screen.getByTestId("newTodoInput"),
      headline: screen.getByTestId("header"),
      user,
    };
  };

  it("should render initial ", () => {
    const { input, headline } = renderComponent();

    expect(headline).toHaveTextContent("todos");
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("placeholder", "What needs to be done?");
  });

  it("should add new todo", async () => {
    const { input, user, mockAddToDo } = renderComponent();

    expect(input).toHaveValue("");
    await user.type(input, "New Todo");
    expect(input).toHaveValue("New Todo");
    await user.keyboard("{Enter}");
    expect(mockAddToDo).toHaveBeenCalledWith({
      text: "New Todo",
      isCompleted: false,
    });
    expect(input).toHaveValue("");
  });
});
