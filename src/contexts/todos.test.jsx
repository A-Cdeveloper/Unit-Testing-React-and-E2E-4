import { render, screen } from "@testing-library/react";
import axios from "axios";
import { useContext, useEffect } from "react";
import { describe, expect } from "vitest";
import {
  TodosContext,
  TodosProvider,
  addTodo,
  getTodos,
  initialState,
  reducer,
} from "./todos";

// Helper test component
const TestingComponent = () => {
  const [todosState, , { addTodo }] = useContext(TodosContext);

  useEffect(() => {
    addTodo({ text: "test", isCompleted: false });
  }, [addTodo]);

  return (
    <>
      <div data-testid="content">{todosState.todos.length}</div>
    </>
  );
};
/////////////////////////////////////////////////////////////
describe("TodosProvider", () => {
  //////////////////////
  it("testing addTodo", async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          text: "test",
          isCompleted: false,
        },
      ],
    };
    vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
    render(
      <TodosProvider>
        <TestingComponent />
      </TodosProvider>
    );

    const content = await screen.findByTestId("content");
    expect(content).toHaveTextContent(1);
  });
});

describe("TodosContext reducer", () => {
  it("should have a default state", () => {
    const newState = reducer(initialState, { type: "unknown" });
    expect(newState).toEqual(initialState);
  });

  it("should add new todo", () => {
    const newState = reducer(initialState, {
      type: "addTodo",
      payload: { id: 1, text: "test", isCompleted: false },
    });
    expect(newState).toEqual({
      ...initialState,
      todos: [{ id: 1, text: "test", isCompleted: false }],
    });
  });

  it("should toggleAll todos", () => {
    const oldState = {
      ...initialState,
      todos: [
        { id: 1, text: "test", isCompleted: false },
        { id: 2, text: "test2", isCompleted: true },
        { id: 3, text: "test3", isCompleted: false },
      ],
    };
    const newState = reducer(oldState, {
      type: "toggleAll",
      payload: true,
    });

    expect(newState.todos.every((todo) => todo.isCompleted)).toBe(true);
  });

  it("should updateTodo todos", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: 1, text: "test", isCompleted: false }],
    };

    const newState = reducer(oldState, {
      type: "updateTodo",
      payload: { id: 1, text: "test10" },
    });

    expect(newState.todos[0].text).toEqual("test10");
  });

  it("should removeTodo todos", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: 1, text: "test", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "removeTodo",
      payload: 1,
    });
    expect(newState.todos.length).toBe(0);
  });

  it("changeFilter function", () => {
    const newState = reducer(initialState, {
      type: "changeFilter",
      payload: "active",
    });
    expect(newState.filter).toBe("active");
  });
});
//////////////////////////////////////////////////////

describe("TodosContext API functions", async () => {
  it("getTodos", async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          text: "test",
          isCompleted: false,
        },
        {
          id: 2,
          text: "test2",
          isCompleted: true,
        },
      ],
    };
    const dispatch = vi.fn();
    vi.spyOn(axios, "get").mockResolvedValue(mockResponse);
    await getTodos(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: "getTodos",
      payload: mockResponse.data,
    });
  });

  it("addTodo", async () => {
    const mockResponse = {
      data: {
        id: 1,
        text: "test",
        isCompleted: false,
      },
    };
    const dispatch = vi.fn();
    vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
    await addTodo(dispatch, { text: "test", isCompleted: false });
    expect(dispatch).toHaveBeenCalledWith({
      type: "addTodo",
      payload: mockResponse.data,
    });
  });
});
