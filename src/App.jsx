import { useState, useEffect } from "react";
import Pagination from "./Components/Paginator/Pagination";
import ToDo from "./Components/ToDo/ToDo";
import ToDoInput from "./Components/ToDoInput/ToDoInput";
import style from "./App.module.css";
// import axios from "axios";
// import { GetRepos } from "./Components/axios/repos";
  const FILTERS = {
    ALL: 0,
    DONE: 1,
    UNDONE: 2,
  };
  const TASK_PER_PAGE = 5;
  

const App = () => {


  const [todos, setTodos] = useState([]);
  const [currentTask, setCurrentTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  
  const [userInput, setUserInput] = useState("");  
  const [sortDate, setSortDate] = useState(false);
  const [filterNow, setFilterNow] = useState(FILTERS.ALL);
  const [statusTaskInput, setStatusTaskInput] = useState();

  const countPages = (todos) => Math.ceil(todos.length / TASK_PER_PAGE) || 1;
  const lastTaskIndex = currentPage * TASK_PER_PAGE;
  const firstTaskIndex = lastTaskIndex - TASK_PER_PAGE;
  const [allNumbersOnPage, setAllNumbersOfPage] = useState(countPages(todos));


  const addTask = (userInput) => {
    if (userInput && !userInput.includes("  ")) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        task: userInput,
        complete: false,
        createdAt: new Date(),
        edit: statusTaskInput,
      }
      // axios.post('https://todo-api-learning.herokuapp.com/v1/tasks/4', {newItem})
      setTodos([...todos, newItem]);
    }
  };

  const removeTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const changeTaskStaus = (id) => {
    const changedStatusInTask = todos.map((todo) =>
      todo.id === id ? { ...todo, complete: !todo.complete } : {...todo} 
    );
    setTodos(changedStatusInTask);
  };



useEffect(() => {
    switch (sortDate){
      case true: 
        setCurrentTask(todos.sort((a, b) => b.createdAt - a.createdAt));
      break;
      case false:
        setCurrentTask(todos.sort((a, b) => a.createdAt - b.createdAt));
        break
    }
},[sortDate])


  const selectedPage = (numbers) => {
    setCurrentPage(numbers);
  };


  const editTaskOnDclick = (id) => {
    console.log(id, userInput)
    const title = userInput;
    if (title) {
      const newTask = todos.map((item) => 
      item.id === id ? {...item, task: title, edit: false} : {...item})
      setTodos(newTask)
    }
  };

  useEffect(() => {
    switch (filterNow) {
      case 1:
        setCurrentTask(todos.filter((item) => item.complete));
        // setCurrentPage(1)
        break;
      case 2:
        setCurrentTask(todos.filter((item) => !item.complete));
        // setCurrentPage(1)
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
          className={filterNow === FILTERS.ALL ? style["data-filter-active"] : style["date-filter"]}
        >
          All
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.DONE)}
          className={filterNow === FILTERS.DONE ? style["data-filter-active"] : style["date-filter"]}
        >
          Done
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.UNDONE)}
          className={filterNow === FILTERS.UNDONE ? style["data-filter-active"] : style["date-filter"]}
        >
          Undone
        </button>
        <button
          className={filterNow === FILTERS.BACK_DATE ? style["data-filter-active"] : style["date-filter"]}
          onClick={() => setSortDate(false)}
        >
          <span>date up</span>
        </button>
        <button
          className={filterNow === FILTERS.FORWARD_DATE ? style["data-filter-active"] : style["date-filter"]}
          onClick={() => setSortDate(true)}
        >
          <span>date down</span>
        </button>
      </div>
      
      <div className={style["todo-list"]}>
        {currentTask.slice(firstTaskIndex, lastTaskIndex).map((todo) => {
          return (
            <ToDo
              todo={todo}
              setTodos={setTodos}
              changeTaskStaus={changeTaskStaus}
              todos={todos}
              removeTask={removeTask}
              userInput={userInput}
              setUserInput={setUserInput}
              statusTaskInput = {statusTaskInput}
              setStatusTaskInput = {setStatusTaskInput}
              editTaskOnDclick={editTaskOnDclick}
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
        {new Array(allNumbersOnPage).fill().map((_, i) => (
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
