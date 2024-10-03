/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

const url = import.meta.env.VITE_API_URL;

export const initialState = {
  todos: [],
  filter: "all",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "getTodos": {
      return {
        ...state,
        todos: action.payload,
      };
    }
    case "addTodo": {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }
    case "toggleAll": {
      const updatedTodos = state.todos.map((todo) => ({
        ...todo,
        isCompleted: action.payload,
      }));
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case "updateTodo": {
      const updatedTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, ...action.payload };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case "removeTodo": {
      const updatedTodos = state.todos.filter(
        (todo) => todo.id !== action.payload
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case "changeFilter": {
      return {
        ...state,
        filter: action.payload,
      };
    }
    default:
      return state;
  }
};

export const changeFilter = async (dispatch, filter) => {
  dispatch({
    type: "changeFilter",
    payload: filter,
  });
};

export const getTodos = async (dispatch) => {
  const response = await axios.get(`${url}/todos`);
  dispatch({
    type: "getTodos",
    payload: response.data,
  });
};

export const addTodo = async (dispatch, todoToCreate) => {
  const response = await axios.post(`${url}/todos`, todoToCreate);
  dispatch({
    type: "addTodo",
    payload: response.data,
  });
};

export const updateTodo = async (dispatch, todoId, fieldsToUpdate) => {
  const response = await axios.put(`${url}/todos/${todoId}`, fieldsToUpdate);
  dispatch({
    type: "updateTodo",
    payload: response.data,
  });
};

export const removeTodo = async (dispatch, todoId) => {
  await axios.delete(`${url}/todos/${todoId}`);
  dispatch({
    type: "removeTodo",
    payload: todoId,
  });
};

export const toggleAll = async (dispatch, isCompleted, todos) => {
  const promises = todos.map((todo) => {
    return axios.put(`${url}/todos/${todo.id}`, {
      text: todo.text,
      isCompleted,
    });
  });
  await Promise.all(promises);
  dispatch({
    type: "toggleAll",
    payload: isCompleted,
  });
};

export const TodosContext = createContext();

export const TodosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    getTodos(dispatch);
  }, []);

  return (
    <TodosContext.Provider
      value={[
        state,
        dispatch,
        {
          addTodo: (todoToCreate) => addTodo(dispatch, todoToCreate),
          updateTodo: (todoId, fieldsToUpdate) =>
            updateTodo(dispatch, todoId, fieldsToUpdate),
          removeTodo: (todoId) => removeTodo(dispatch, todoId),
          changeFilter: (filter) => changeFilter(dispatch, filter),
          toggleAll: (isCompleted) =>
            toggleAll(dispatch, isCompleted, state.todos),
          getTodos: () => getTodos(dispatch),
        },
      ]}
    >
      {children}
    </TodosContext.Provider>
  );
};
