import { useContext } from "react";

import { TodosContext } from "../contexts/todos";

const Footer = () => {
  const [todosState, , { changeFilter }] = useContext(TodosContext);
  const noTodosClass = todosState.todos.length === 0 ? "hidden" : "";
  const activeCount = todosState.todos.filter(
    (todo) => !todo.isCompleted
  ).length;
  const itemsLeftText = ` item${activeCount !== 1 ? "s" : ""} left`;
  const getSelectedClass = (filterName) => {
    return todosState.filter === filterName ? "selected" : "";
  };
  const changeActiveFilter = (event, filterName) => {
    event.preventDefault();
    changeFilter(filterName);
  };

  return (
    <footer className={`footer ${noTodosClass}`} data-testid="footer">
      <span className="todo-count" data-testid="todoCount" data-cy="todoCount">
        <strong>{activeCount}</strong>
        {itemsLeftText}
      </span>
      <ul className="filters">
        <li>
          <a
            href="/"
            data-testid="filterLink"
            data-cy="filterLink"
            className={getSelectedClass("all")}
            onClick={(event) => changeActiveFilter(event, "all")}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="/"
            data-testid="filterLink"
            data-cy="filterLink"
            className={getSelectedClass("active")}
            onClick={(event) => changeActiveFilter(event, "active")}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="/"
            data-testid="filterLink"
            data-cy="filterLink"
            className={getSelectedClass("completed")}
            onClick={(event) => changeActiveFilter(event, "completed")}
          >
            Completed
          </a>
        </li>
      </ul>
    </footer>
  );
};
export default Footer;
