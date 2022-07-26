import { useState, useEffect } from "react";
import Pagination from "./Components/Paginator/Pagination";
import ToDo from "./Components/ToDo/ToDo";
import ToDoInput from "./Components/ToDoInput/ToDoInput";
import style from "./App.module.css";
import { FILTERS, TASK_PER_PAGE } from "./Constant/todos";
import {
  postTask,
  deleteTask,
  changeDoneStatusTask,
  changeNameForTask,
  getTasks,
} from "./Components/Server/LocalServer";
import SweetAlert from "./Utilits/Alert/alert";
import TaskFilter from "./Components/Filtration/TaskFilter";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [sortDate, setSortDate] = useState(false);
  const [currentFilter, setFilterNow] = useState(FILTERS.ALL);

  const [tasksCount, setTasksCount] = useState(0);
  const [edit, setEdit] = useState();
  const [allNumbersOnPage, setAllNumbersOfPage] = useState(countPages(todos));


  function countPages(todos){
    return Math.ceil(todos.length / TASK_PER_PAGE) || 1;
  }
  const fetchTodos = async () => {
    const { data } = await getTasks(currentFilter, sortDate, currentPage).catch(
      (error) =>
        SweetAlert(
          error,
          "Oops!",
          "Error receiving data from the server. Try again"
        )
    );
    setTodos(data.todos);
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
              SweetAlert(
                error,
                "Task not created",
                "The task has already exist"
              );
              break;
            case 422:
              SweetAlert(
                error,
                "Invalid symbols in the field",
                "Try to rewrite your task"
              );
              break;
            default:
              SweetAlert(error, "Oops!", "Unknown error!");
          }
        });
    }
  };
 

  const removeTask = (uuid) => {

    deleteTask(uuid)
      .then(() => {
        const arrAfterDeleteTask = todos.filter((item) => item.uuid !== uuid);
        setTodos(arrAfterDeleteTask);
        setTasksCount(tasksCount - 1);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
            SweetAlert(
              error,
              "Task not found",
              "It seems like the task has been already deleted or doesn't exist"
            );
            break;
          default:
            SweetAlert(error, "Oops!", "Something went wrong!");
        }
      });
  };

  const changeTaskStatus = (uuid, done) => {
    changeDoneStatusTask(uuid, done)
      .then(() => {
        setTodos(
          todos.filter((item) => {
            if (item.uuid === uuid) {
              item.done = !item.done; 
            }
            return item;
          })
        );
        if (currentFilter !== FILTERS.ALL) fetchTodos();
      })
      .catch((error) => {
        SweetAlert(error, "Oops!", "Something went wrong!");
      });
  };

  

  const selectedPage = (numbers) => {
    setCurrentPage(numbers);
  };

  const editTaskName = (uuid) => {
    if (userInput) {
      changeNameForTask(uuid, userInput)
        .then(() => {
          const newTodo = todos.map((todo) => {
              if (todo.uuid === uuid) {
                const editedTodo = {
                  ...todo,
                  name: userInput,
                };
                return editedTodo;
              }
              return todo;
            })
          setTodos(newTodo);
        })
        .catch((error) => {
          switch (error.response.status) {
            case 400:
              SweetAlert(
                error,
                "Task not created",
                "The task has already exist"
              );
              break;
            case 422:
              SweetAlert(
                error,
                "Invalid symbols in the field",
                "Try to rewrite your task"
              );
              break;
            default:
              SweetAlert(error, "Oops!", "Unknown error!");
          }
        });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [sortDate, currentPage, currentFilter, tasksCount,]);

  useEffect(() => {
    if (currentPage <= allNumbersOnPage) {
      setCurrentPage(currentPage);
    } else if (currentPage >= 2) {
      setCurrentPage(currentPage - 1 || 1);
    }
  }, [todos]);

 

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
        setFilterNow={setFilterNow}
        FILTERS={FILTERS}
        setSortDate={setSortDate}
        currentFilter={currentFilter}
      />

      <div className={style["todo-list"]}>
        {todos.map((todo) => {
          return (
            <ToDo
              todo={todo}
              changeTaskStatus={changeTaskStatus}
              removeTask={removeTask}
              userInput={userInput}
              setUserInput={setUserInput}
              editTaskName={editTaskName}
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
