import style from "./ToDo.module.css";

const ToDo = ({
  userInput,
  setUserInput,
  setTodos,
  todo,
  todos,
  changeTaskStaus,
  removeTask,
  editTaskOnDclick
}) => {
 

  const keyPress = (event, id) => {
    switch (event.key) {
      case "Enter":
        editTaskOnDclick(id);
        // changeStatusInput(id)
        break;
      case "Escape":
        changeStatusInput(id)
        break;
      default:
        break;
    }
  };

  const blurInput = (event, id) => {
    editTaskOnDclick(event, id);
  };


  const changeStatusInput = (id) => {
    setUserInput("");
    const changedStatusInput = todos.map((todo) =>
    todo.id === id ? { ...todo, edit: !todo.edit,  } : {...todo});
    setTodos(changedStatusInput);
  };

  const handleChange = (event) => {
    setUserInput(event.currentTarget.value);
  };

  return (
    <div className={style["item-todo"]}>
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
            {todo.edit === true ? (
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
                onDoubleClick={() => 
                  changeStatusInput(todo.id)
                }
              >
                {todo.task}
              </div>
            )}
          </div>
        </div>
        <div className={style["right-side"]}>
          <div className={style["date-task"]}>{todo.createdAt.toLocaleTimeString()}</div>
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
