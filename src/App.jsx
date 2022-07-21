import { useState, useEffect } from "react";
import Pagination from "./Components/Paginator/Pagination";
import ToDo from "./Components/ToDo/ToDo";
import ToDoInput from "./Components/ToDoInput/ToDoInput";
import style from "./App.module.css";
import axios from "axios";
import Swal from 'sweetalert2'
import { FILTERS } from "./Constant/todos";
import { TASK_PER_PAGE } from "./Constant/todos";

  

const App = () => {


  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  
  const [userInput, setUserInput] = useState("");  
  const [sortDate, setSortDate] = useState(false);
  const [filterNow, setFilterNow] = useState(FILTERS.ALL);
  // const [statusTaskInput, setStatusTaskInput] = useState();
  const [tasksCount, setTasksCount] = useState(0)
  const [edit, setEdit] = useState()

  const countPages = (todos) => Math.ceil(todos.length / TASK_PER_PAGE) || 1;
  // const lastTaskIndex = currentPage * TASK_PER_PAGE;
  // const firstTaskIndex = lastTaskIndex - TASK_PER_PAGE;
  const [allNumbersOnPage, setAllNumbersOfPage] = useState(countPages(todos));

const currentFilter = (filterNow) => {
  let filter = '';
  if (filterNow === 1) filter = 'done';
  if (filterNow === 2) filter = 'undone';
  if (filterNow === 0) filter = ''; 
  return filter 
}
  const fetchTodos = async () => {
    const filter = currentFilter(filterNow)
    const { data } = await axios
      .get(
        `https://todo-api-learning.herokuapp.com/v1/tasks/4?filterBy=${filter}&order=${sortDate ? 'asc' : 'desc'}&pp=5&page=${currentPage}`
      ).catch((error) => {
      Swal.fire({
        background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
        border: 'border-color: rgb(255, 217, 255);',
        color: 'white',
        icon: 'error',
        title: 'Oops!',
        text: 'Error receiving data from the server. Try again ',
        footer: `Status code: ${error.response.status}`,
      })
    });
    setTodos(data.tasks);
    setTasksCount(data.count)
    setAllNumbersOfPage(Math.ceil(tasksCount / 5) || 1)
      }


  const addTask = (userInput) => {
    if (userInput && !userInput.includes("  ")) {
      axios.post("https://todo-api-learning.herokuapp.com/v1/task/4", {
        name: userInput,
        done: false,
      })
      .then(() => {
        setTasksCount(tasksCount + 1)
        }).catch((error) => {
          switch (error.response.status) {
            case 400:
              Swal.fire({
                background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
                border: 'border-color: rgb(255, 217, 255);',
                color: 'white',
                icon: 'error',
                title: 'Task not created',
                text: 'The task has already exist',
                footer: `Status code: ${error.response.status}`,
              })
              break;
            case 422:
              Swal.fire({
                background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
                border: 'border-color: rgb(255, 217, 255);',
                color: 'white',
                icon: 'error',
                title: 'Invalid symbols in the field',
                text: 'Try to rewrite your task',
                footer: `Status code: ${error.response.status}`,
              })
              break;
            default:
              Swal.fire({
                background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
                border: 'border-color: rgb(255, 217, 255);',
                color: 'white',
                icon: 'error',
                title: 'Oops!',
                text: 'Unknown error!',
                footer: `Status code: ${error.response.status}`,
              })
            }})
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
    }).catch((error) => {
      switch (error.response.status) {
        case 404:
          Swal.fire({
            background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
            border: 'border-color: rgb(255, 217, 255);',
            color: 'white',
            icon: 'error',
            title: 'Task not found',
            text: 'It seems like the task has been already deleted or doesn\'t exist',
            footer: `Status code: ${error.response.status}`,
          })
          break;
        default:
          Swal.fire({
            background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
            border: 'border-color: rgb(255, 217, 255);',
            color: 'white',
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong!',
            footer: `Status code: ${error.response.status}`,
          })
      }
    })
}
        
      

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
      if (filterNow !== FILTERS.ALL) fetchTodos();
    }) .catch((error) => {
      Swal.fire({
        background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
        border: 'border-color: rgb(255, 217, 255);',
        color: 'white',
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong!',
        footer: `Status code: ${error.response.status}`})
      })}
      
    // const changedStatusInTask = todos.map((todo) =>
    //   todo.id === id ? { ...todo, complete: !todo.complete } : {...todo} 
    // );
    // setTodos(changedStatusInTask);

  const selectedPage = (numbers) => {
    setCurrentPage(numbers);
  };


  const editTaskOnDclick = (uuid) => {
    const title = userInput;
     if (title) {
    axios.patch(`https://todo-api-learning.herokuapp.com/v1/task/4/${uuid}`, {name: title}).then(()=>{
      setTodos(
        todos.map((todo) => {
          if (todo.uuid === uuid) {
            const editedTodo = {
              ...todo,
              name: title
            };
            return editedTodo;
          }
          return todo;
        })
      );
    }).catch((error) => {
      switch (error.response.status) {
        case 400:
          Swal.fire({
            background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
            border: 'border-color: rgb(255, 217, 255);',
            color: 'white',
            icon: 'error',
            title: 'Task not created',
            text: 'The task has already exist',
            footer: `Status code: ${error.response.status}`,
          })
          break;
        case 422:
          Swal.fire({
            background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
            border: 'border-color: rgb(255, 217, 255);',
            color: 'white',
            icon: 'error',
            title: 'Invalid symbols in the field',
            text: 'Try to rewrite your task',
            footer: `Status code: ${error.response.status}`,
          })
          break;
        default:
          Swal.fire({
            background: 'linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)',
            border: 'border-color: rgb(255, 217, 255);',
            color: 'white',
            icon: 'error',
            title: 'Oops!',
            text: 'Unknown error!',
            footer: `Status code: ${error.response.status}`,
          })
        }})
     }
  };
  


  useEffect(() => {
 fetchTodos()
  }, [sortDate, currentPage, filterNow, tasksCount,])


  useEffect(() => {
    if (currentPage <= allNumbersOnPage) {
      setCurrentPage(currentPage);
    } else if (currentPage >= 2) {
      setCurrentPage(currentPage - 1 || 1);
    }
  }, [todos]);
  
  //   useEffect(() => {
//     switch (sortDate){
//       case true: 
//       setTodos(todos.sort((a, b) => b.createdAt - a.createdAt));
//       break;
//       case false:
//         setTodos(todos.sort((a, b) => a.createdAt - b.createdAt));
//         break;
//       default: break;
//     }
// },[sortDate])

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
  //   changeTaskStatus()
  //   }, [sortDate, currentPage, filterNow, tasksCount ])

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
              changeTaskStatus={changeTaskStatus}
              removeTask={removeTask}
              userInput={userInput}
              setUserInput={setUserInput}
              editTaskOnDclick={editTaskOnDclick}
              key={todo.uuid}
              edit = {edit}
              setEdit={setEdit}
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
