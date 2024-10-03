import { useEffect, useRef, useContext, useState } from "react";

import { TodosContext } from "../contexts/todos";

const Todo = ({ todo, isEditing, setEditingId }) => {
  const editingClass = isEditing ? "editing" : "";
  const completedClass = todo.isCompleted ? "completed" : "";
  const [, , { updateTodo, removeTodo }] = useContext(TodosContext);
  const [editText, setEditText] = useState(todo.text);
  const editInputEl = useRef(null);

  const setTodoInEditingMode = () => {
    setEditingId(todo.id);
  };
  const toggleTodo = () => {
    updateTodo(todo.id, {
      text: todo.text,
      isCompleted: !todo.isCompleted,
    });
  };
  const changeEditInput = (event) => {
    setEditText(event.target.value);
  };
  const keyDownEditInput = (event) => {
    if (event.key === "Enter") {
      updateTodo(todo.id, {
        text: event.target.value,
        isCompleted: todo.isCompleted,
      });
      setEditingId(null);
    }

    if (event.key === "Escape") {
      setEditText(todo.text);
      setEditingId(null);
    }
  };

  useEffect(() => {
    if (isEditing) {
      editInputEl.current.focus();
    }
  });

  return (
    <li
      className={`${editingClass} ${completedClass}`}
      data-testid="todo"
      data-cy="todo"
    >
      <div className="view">
        <input
          className="toggle"
          data-testid="toggle"
          data-cy="todoCheckbox"
          type="checkbox"
          checked={todo.isCompleted}
          onChange={toggleTodo}
        />
        <label
          onDoubleClick={setTodoInEditingMode}
          data-testid="label"
          data-cy="todoLabel"
        >
          {todo.text}
        </label>
        <button
          className="destroy"
          data-cy="destroy"
          onClick={() => removeTodo(todo.id)}
          data-testid="destroy"
        />
      </div>
      {isEditing && (
        <input
          className="edit"
          data-testid="edit"
          data-cy="todoEdit"
          ref={editInputEl}
          value={editText}
          onChange={changeEditInput}
          onKeyDown={keyDownEditInput}
        />
      )}
    </li>
  );
};

export default Todo;
