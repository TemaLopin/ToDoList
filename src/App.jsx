import { useState, useEffect } from "react";
import Pagination from "./Components/Paginator/Pagination";
import ToDo from "./Components/ToDo/ToDo";
import ToDoInput from "./Components/ToDoInput/ToDoInput";
import style from "./App.module.css";

const App = () => {
  const FILTERS = {
    ALL: 0,
    DONE: 1,
    UNDONE: 2,
    FORWARD_DATE: 3,
    BACK_DATE: 4,
  };
  const [todos, setTodos] = useState([]);
  const [currentTask, setCurrentTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const TASK_PER_PAGE = 5;
  const [userInput, setUserInput] = useState("");
  const lastTaskIndex = currentPage * TASK_PER_PAGE;
  const firstTaskIndex = lastTaskIndex - TASK_PER_PAGE;
  const countPages = (todos) => Math.ceil(todos.length / TASK_PER_PAGE) || 1;
  const [allNumbersOnPage, setAllNumbersOfPage] = useState(countPages(todos));
  const [filterNow, setFilterNow] = useState(FILTERS.ALL);

  const addTask = (userInput) => {
    if (userInput && !userInput.includes("  ")) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        task: userInput,
        complete: false,
        createdAt: new Date(),
      };
      setTodos([...todos, newItem]);
    }
  };

  const removeTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const changeTaskStaus = (id) => {
    const changedStatusInTask = todos.map((todo) =>
      todo.id === id ? { ...todo, complete: !todo.complete } : { ...todo }
    );
    setTodos(changedStatusInTask);
  };

  const selectedPage = (numbers) => {
    setCurrentPage(numbers);
  };

  useEffect(() => {
    switch (filterNow) {
      case 1:
        const arrByFilterDone = todos.filter((item) => item.complete);
        setCurrentTask(arrByFilterDone);
        // setCurrentPage(1)
        break;
      case 2:
        const arrByFilterUndone = todos.filter((item) => !item.complete);
        setCurrentTask(arrByFilterUndone);
        // setCurrentPage(1)
        break;
      case 3:
        setCurrentTask(todos.sort((a, b) => b.createdAt - a.createdAt));
        break;
      case 4:
        setCurrentTask(todos.sort((a, b) => a.createdAt - b.createdAt));
        break;
      default:
        setCurrentTask(todos);
    }
  }, [filterNow, todos]);

  useEffect(() => {
    if (currentPage <= allNumbersOnPage) {
      setCurrentPage(currentPage);
    } else if (currentPage >= 2) {
      setCurrentPage(currentPage - 1 || 1);
    }
  }, [allNumbersOnPage]);

  useEffect(() => {
    setAllNumbersOfPage(countPages(currentTask));
  }, [filterNow, allNumbersOnPage, currentTask]);

  // useEffect(() => {
  //   setCurrentTask(todos);
  // }, [ todos]);

  return (
    <div className={style["App"]}>
      <header>
        <h1>ToDo</h1>
      </header>
      <ToDoInput
        addTask={addTask}
        userInput={userInput}
        setUserInput={setUserInput}
      />
      <div className={style[`filter-button-list`]}>
        <button
          onClick={() => setFilterNow(FILTERS.ALL)}
          className={style[`filter-button`]}
        >
          All
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.DONE)}
          className={style[`filter-button`]}
        >
          Done
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.UNDONE)}
          className={style[`filter-button`]}
        >
          Undone
        </button>
        <button
          className={style["date-filter"]}
          onClick={() => setFilterNow(FILTERS.BACK_DATE)}
        >
          <span>date up</span>
        </button>
        <button
          className={style["date-filter"]}
          onClick={() => setFilterNow(FILTERS.FORWARD_DATE)}
        >
          <span>date down</span>
        </button>
      </div>

      <div className={style["todo-list"]}>
        {currentTask.slice(firstTaskIndex, lastTaskIndex).map((todo) => {
          return (
            <ToDo
              todo={todo}
              addTask={addTask}
              key={todo.id}
              setTodos={setTodos}
              changeTaskStaus={changeTaskStaus}
              todos={todos}
              removeTask={removeTask}
              userInput={userInput}
              setUserInput={setUserInput}
            />
          );
        })}
      </div>
      <div className={style["pagination-block"]}>
        {currentPage > 1 ? (
          <span
            className={style["first-page"]}
            onClick={() => setCurrentPage(1)}
          >
            &#171;
          </span>
        ) : (
          <span> </span>
        )}
        {new Array(allNumbersOnPage).fill().map((item, i) => (
          <Pagination
            i={i + 1}
            selectedPage={selectedPage}
            currentPage={currentPage}
            key={i}
          />
        ))}
        {currentPage < allNumbersOnPage ? (
          <span
            className={style["last-page"]}
            onClick={() => setCurrentPage(allNumbersOnPage)}
          >
            &#187;
          </span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default App;
