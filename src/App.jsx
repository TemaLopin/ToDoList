import { useState, useEffect } from "react";
import Pagination from "./Components/Paginator/Pagination";
import ToDo from "./Components/ToDo/ToDo";
import ToDoInput from "./Components/ToDoInput/ToDoInput";
import style from "./App.module.css";
import { FILTERS, TASK_PER_PAGE } from "./Constant/todos";
import { postTask, deleteTask, changeDoneStatusTask, getTasks, changeNameForTask} from './Components/Server/server'
import SweetAlert from "./Utilits/Alert/alert";
import TaskFilter from "./Components/Filtration/TaskFilter";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [sortDate, setSortDate] = useState(false);
  const [filterNow, setFilterNow] = useState(FILTERS.ALL);
  // const [statusTaskInput, setStatusTaskInput] = useState();
  const [tasksCount, setTasksCount] = useState(0);
  const [edit, setEdit] = useState();
  
  const countPages = (todos) => Math.ceil(todos.length / TASK_PER_PAGE) || 1;
  const [allNumbersOnPage, setAllNumbersOfPage] = useState(countPages(todos));
  // const lastTaskIndex = currentPage * TASK_PER_PAGE;
  // const firstTaskIndex = lastTaskIndex - TASK_PER_PAGE;

  const currentFilter = (filterNow) => {
    let filter = "";
    if (filterNow === 1) filter = "done";
    if (filterNow === 2) filter = "undone";
    if (filterNow === 0) filter = "";
    return filter;
  };
  const fetchTodos = async (filterNow, sortDate, currentPage) => {
    const filter = currentFilter(filterNow);
    const { data } = await getTasks(filter, sortDate, currentPage)
    .catch((error) => SweetAlert(error,'Oops!', "Error receiving data from the server. Try again"));
    setTodos(data.tasks);
    setTasksCount(data.count);
    setAllNumbersOfPage(Math.ceil(tasksCount / 5) || 1);
  };

  const addTask = (userInput) => {
    if (userInput && !userInput.includes("  ")) {
      postTask(userInput)
        .then(() => {
          setTasksCount(tasksCount + 1);
        })
        .catch((error) => {
          switch (error.response.status) {
            case 400:
              SweetAlert(error,'Task not created', 'The task has already exist')
              break;
            case 422:
              SweetAlert(error,'Invalid symbols in the field',  'Try to rewrite your task' )
              break;
            default:
              SweetAlert(error, 'Oops!', 'Unknown error!' )
    }});
          }
        }
      // const newItem = {
      //   id: Math.random().toString(36).substr(2, 9),
      //   task: userInput,
      //   complete: false,
      //   createdAt: new Date(),
      //   edit: statusTaskInput,
      // }
      // setTodos([...todos, newItem]);
    
  ;

  const removeTask = (uuid) => {
    // setTodos(todos.filter((todo) => todo.id !== id));
      deleteTask(uuid)
      .then(() => {
        const deletedTask = todos.filter((item) => item.uuid !== uuid);
        setTodos(deletedTask); // naming
        setTasksCount(tasksCount - 1);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
           SweetAlert(error,'Task not found', 'It seems like the task has been already deleted or doesn\'t exist')
            break;
          default:
            SweetAlert(error,'Oops!', 'Something went wrong!'  )
            }});
        }
  

  const changeTaskStatus = (uuid, done) => {
    changeDoneStatusTask(uuid, done) 
      .then(() => {
        setTodos(
          todos.filter((item) => {
            if (item.uuid === uuid) {
              item.done = !item.done; //
            }
            return item;
          })
        );
        if (filterNow !== FILTERS.ALL) fetchTodos();
      })
      .catch((error) => {
        SweetAlert(error,'Oops!', 'Something went wrong!' )
        });
      
  };

  // const changedStatusInTask = todos.map((todo) =>
  //   todo.id === id ? { ...todo, complete: !todo.complete } : {...todo}
  // );
  // setTodos(changedStatusInTask);

  const selectedPage = (numbers) => {
    setCurrentPage(numbers);
  };

  const editTaskOnDclick = (uuid) => {//
    if (userInput) {
      changeNameForTask(uuid, userInput).then(() => {
        const newTodo = todos.map((item) => {
          if (item.uuid === uuid) {
            const newItem = { ...item }
            newItem.done = !newItem.done;
            return newItem;
          }
          return item;
        })
        setTodos(newTodo);})
        .catch((error) => {
          switch (error.response.status) {
            case 400:
              SweetAlert(error,'Task not created', 'The task has already exist' )
              break;
            case 422:
              SweetAlert(error,'Invalid symbols in the field',  'Try to rewrite your task')
              break;
            default:
             SweetAlert(error,'Oops!','Unknown error!' )
          }
        });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [sortDate, currentPage, filterNow, tasksCount]);

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
      <TaskFilter 
      setFilterNow = {setFilterNow}
       FILTERS = {FILTERS}
      setSortDate = {setSortDate}
      filterNow={filterNow}/>

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
              edit={edit}
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
