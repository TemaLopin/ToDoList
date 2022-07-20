import { useState, useEffect } from "react";
import Pagination from "./Components/Paginator/Pagination";
import ToDo from "./Components/ToDo/ToDo";
import ToDoInput from "./Components/ToDoInput/ToDoInput";
import style from "./App.module.css";
import axios from "axios";

  const FILTERS = {
    ALL: 0,
    DONE: 1,
    UNDONE: 2,
  };
  const TASK_PER_PAGE = 5;
  

const App = () => {


  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  
  const [userInput, setUserInput] = useState("");  
  const [sortDate, setSortDate] = useState(false);
  const [filterNow, setFilterNow] = useState(FILTERS.ALL);
  // const [statusTaskInput, setStatusTaskInput] = useState();
  const [tasksCount, setTasksCount] = useState(0)


  const countPages = (todos) => Math.ceil(todos.length / TASK_PER_PAGE) || 1;
  // const lastTaskIndex = currentPage * TASK_PER_PAGE;
  // const firstTaskIndex = lastTaskIndex - TASK_PER_PAGE;
  const [allNumbersOnPage, setAllNumbersOfPage] = useState(countPages(todos));





  const addTask = (userInput) => {
    if (userInput && !userInput.includes("  ")) {
      axios.post("https://todo-api-learning.herokuapp.com/v1/task/4", {
        name: userInput,
        done: false,
      })
      .then((res) => {
        console.log(res.data)
        // const result = [...todos, res.data]
        // if (result.length <= TASK_PER_PAGE) {
          // setTodos(result);
        // }
        setTasksCount(tasksCount + 1)
      }).catch((e) =>console.log(e))
      setUserInput("");
      // const newItem = {
      //   id: Math.random().toString(36).substr(2, 9),
      //   task: userInput,
      //   complete: false,
      //   createdAt: new Date(),
      //   edit: statusTaskInput,
      // }
      // setTodos([...todos, newItem]);
    }
  };

  const removeTask = (uuid) => {
    // setTodos(todos.filter((todo) => todo.id !== id));
    axios.delete(`https://todo-api-learning.herokuapp.com/v1/task/4/${uuid}`).then(() => {
      const deletedTask = todos.filter((item) => item.uuid !== uuid);
      setTodos(deletedTask);// naming
      setTasksCount(tasksCount - 1)
    }).catch((e) =>alert(`Error! ${e}`))

  };

  const changeTaskStatus = (uuid, done) => {
    axios.patch(`https://todo-api-learning.herokuapp.com/v1/task/4/${uuid}`, {done: !done}).then(() => {
      setTodos(
        todos.filter((item) => {
          if (item.uuid === uuid) {
            item.done = !item.done;
          }
          return item;
        })
      );
    }).catch((e) =>console.log(`Error! ${e}`))
    // const changedStatusInTask = todos.map((todo) =>
    //   todo.id === id ? { ...todo, complete: !todo.complete } : {...todo} 
    // );
    // setTodos(changedStatusInTask);
  };

  const selectedPage = (numbers) => {
    setCurrentPage(numbers);
  };


  const editTaskOnDclick = (uuid) => {
    console.log(uuid, userInput)
    const title = userInput;
    if (title) {
      const newTask = todos.map((item) => 
      item.uuid === uuid ? {...item, task: title, edit: false} : {...item})
      setTodos(newTask)
    }
  };
  


  useEffect(() => {
    const fetchData = async () => {
      let filter = '';
      if (filterNow === 1) filter = 'done';
      if (filterNow === 2) filter = 'undone';
      if (filterNow === 0) filter = ''; 

      const { data } = await axios
        .get(
          `https://todo-api-learning.herokuapp.com/v1/tasks/4?filterBy=${filter}&order=${sortDate ? 'asc' : 'desc'}&pp=5&page=${currentPage}`
        ).catch(e =>{
          switch (e.response.status) {
            case 400: alert('task not created');
          
          }
        })
      setTodos(data.tasks);
      setTasksCount(data.count)
      setAllNumbersOfPage(Math.ceil(tasksCount / 5) || 1)
        }
    fetchData()
    
  }, [todos])
  useEffect(() => {
    switch (sortDate){
      case true: 
      setTodos(todos.sort((a, b) => b.createdAt - a.createdAt));
      break;
      case false:
        setTodos(todos.sort((a, b) => a.createdAt - b.createdAt));
        break;
      default: break;
    }
},[sortDate])




  // useEffect(() => {
  //   switch (filterNow) {
  //     case 1:
  //       setCurrentTask(todos.filter((item) => item.complete));
  //       break;
  //     case 2:
  //       setCurrentTask(todos.filter((item) => !item.complete));
  //       break;
  //     default:
  //       setCurrentTask(todos);
  //   }
  // }, [filterNow, todos]);


  // useEffect(() => {
  //   if (currentPage <= allNumbersOnPage) {
  //     setCurrentPage(currentPage);
  //   } else if (currentPage >= 2) {
  //     setCurrentPage(currentPage - 1 || 1);
  //   }
  // }, [allNumbersOnPage]);

  // useEffect(() => {
  //   setAllNumbersOfPage(countPages(todos));
  // }, [ allNumbersOnPage]);



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
        {todos.map((todo) => {
          return (
            <ToDo
              todo={todo}
              setTodos={setTodos}
              changeTaskStatus={changeTaskStatus}
              todos={todos}
              removeTask={removeTask}
              userInput={userInput}
              setUserInput={setUserInput}
              editTaskOnDclick={editTaskOnDclick}
              key={todo.uuid}
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
