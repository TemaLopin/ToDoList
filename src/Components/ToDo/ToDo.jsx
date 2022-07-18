import { useState } from "react";
import style from "./ToDo.module.css";

const ToDo = ({
  userInput,
  setUserInput,
  setTodos,
  todo,
  todos,
  changeTaskStaus,
  removeTask,
}) => {
  const [statusTaskInput, setStatusTaskInput] = useState(0);
  const getDate = () => {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const years = new Date().getFullYear();
    return (
      <p>
        {day}/{month}/{years}
      </p>
    );
  };
  const keyPress = (event, id) => {
    switch (event.key) {
      case "Enter":
        submitTask(event, id);
        setStatusTaskInput(0);
        break;
      case "Escape":
        setStatusTaskInput(0);
        break;
      default:
        break;
    }
  };
  const blurInput = (event, id) => {
    submitTask(event, id);
  };
  const submitTask = (event, id) => {
    const title = userInput;
    if (title) {
      const task = todos.find((todo) => todo.id === id);
      const newTask = todos.map((item) => {
        if (item.id === task.id) {
          console.log(id, item.id);
          const newItem = { ...item };
          console.log(newItem);
          newItem.task = title;
          return newItem;
        }
        return item;
      });
      setTodos(newTask);
    }
  };

  const changeStatusInput = () => {
    setUserInput("");
    setStatusTaskInput(1);
  };

  const handleChange = (event) => {
    setUserInput(event.currentTarget.value);
  };

  return (
    <div key={todo.id} className={style["item-todo"]}>
      <div className={style["task-block"]}>
        <div className={style["left-side"]}>
          <div onClick={() => changeTaskStaus(todo.id)}>
            {todo.complete ? <span>&#10006;</span> : <span>&#10004;</span>}
          </div>
          <div
            className={
              todo.complete
                ? `${`${style["item-text"]} ${style["strike"]}`}`
                : style["item-text"]
            }
          >
            {statusTaskInput === 1 ? (
              <input
                className={style["editTask"]}
                autoFocus
                placeholder={todo.task}
                onBlur={() => {
                  blurInput(todo.id);
                }}
                onKeyDown={(event) => {
                  keyPress(event, todo.id);
                }}
                value={userInput}
                onChange={handleChange}
                type="text"
              />
            ) : (
              <div
                className={style["task__text"]}
                id={todo.id}
                onDoubleClick={() => {
                  changeStatusInput();
                }}
              >
                {todo.task}
              </div>
            )}
          </div>
        </div>
        <div className={style["right-side"]}>
          <div className={style["date-task"]}>{getDate()}</div>
          <div
            className={style["item-delete"]}
            onClick={() => removeTask(todo.id)}
          >
            &#128465;
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
