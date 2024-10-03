import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { TodosContext } from "../contexts/todos";
import Todo from "./Todo";

describe("Todo", () => {
  const renderComponent = (isEditing) => {
    const mochDispatch = vi.fn();
    const updateMockTodo = vi.fn();
    const removeMockTodo = vi.fn();
    const mockEditingId = vi.fn();

    const mockedTodo = {
      id: 1,
      text: "First todo",
      isCompleted: false,
    };

    const user = userEvent.setup();

    render(
      <TodosContext.Provider
        value={[
          {},
          mochDispatch,
          { updateTodo: updateMockTodo, removeTodo: removeMockTodo },
        ]}
      >
        <Todo
          todo={{ id: 1, text: "First todo", isCompleted: false }}
          isEditing={isEditing}
          setEditingId={mockEditingId}
        />
      </TodosContext.Provider>
    );
    return {
      mochDispatch,
      updateMockTodo,
      removeMockTodo,
      mockEditingId,
      todo: screen.getByTestId("todo"),
      label: screen.getByTestId("label"),
      checkbox: screen.getByTestId("toggle"),
      deleteButton: screen.getByTestId("destroy"),
      edit: screen.queryByTestId("edit"),
      mockedTodo,
      user,
    };
  };

  it("should render default state", () => {
    const { todo, label, checkbox, deleteButton, edit } =
      renderComponent(false);

    expect(todo).not.toHaveClass("completed");
    expect(todo).not.toHaveClass("editing");
    expect(label).toHaveTextContent("First todo");
    expect(checkbox).not.toBeChecked();
    expect(deleteButton).toBeInTheDocument();
    expect(edit).not.toBeInTheDocument();
  });

  ////////////////////////
  it("should toogle todo state", async () => {
    const { checkbox, mockedTodo, user, updateMockTodo } =
      renderComponent(false);

    await user.click(checkbox);
    expect(updateMockTodo).toHaveBeenCalled(mockedTodo.id, {
      text: mockedTodo.text,
      isCompleted: true,
    });
  });

  it("should  delete todo", async () => {
    const { deleteButton, mockedTodo, user, removeMockTodo } =
      renderComponent(false);
    await user.click(deleteButton);
    expect(removeMockTodo).toHaveBeenCalled(mockedTodo.id);
  });

  it("should  activate editing mode", async () => {
    const { label, mockEditingId, user, mockedTodo } = renderComponent(false);

    await user.dblClick(label);
    expect(mockEditingId).toHaveBeenCalledWith(mockedTodo.id);
  });

  it("should update todo", async () => {
    const { edit, updateMockTodo, user, mockedTodo } = renderComponent(true);
    await user.clear(edit);
    await user.type(edit, "New Text{Enter}");

    expect(updateMockTodo).toHaveBeenCalledWith(mockedTodo.id, {
      text: "New Text",
      isCompleted: false,
    });
  });

  it("should focus input when edit mode is active", async () => {
    const { edit } = renderComponent(true);
    expect(edit).toHaveFocus();
  });
});
