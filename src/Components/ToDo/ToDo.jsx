import style from "./ToDo.module.css";

const ToDo = ({
  userInput,
  setUserInput,
  setTodos,
  todo,
  todos,
  changeTaskStatus,
  removeTask,
  editTaskOnDclick, 

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


  const changeStatusInput = (uuid) => {
    setUserInput("");
    const changedStatusInput = todos.map((todo) =>
    todo.uuid === uuid ? { ...todo, edit: !todo.edit,  } : {...todo});
    setTodos(changedStatusInput);
  };

  const handleChange = (event) => {
    setUserInput(event.currentTarget.value);
  };

  return (
    <div key={todo.id} className={style["item-todo"]}>
      <div className={style["task-block"]}>
        <div className={style["left-side"]}>
          <div onClick={() => changeTaskStatus(todo.uuid)}>
            {todo.done ? <span>&#10006;</span> : <span>&#10004;</span>}
          </div>
          <div
            className={
              todo.done
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
                  blurInput(todo.uuid);
                }}
                onKeyDown={(event) => {
                  keyPress(event, todo.uuid);
                }}
                value={userInput}
                onChange={handleChange}
                type="text"
              />
            ) : (
              <div
                className={style["task__text"]}
                id={todo.uuid}
                onDoubleClick={() => 
                  changeStatusInput(todo.uuid)
                }
              >
                {todo.name}
              </div>
            )}
          </div>
        </div>
        <div className={style["right-side"]}>
          <div className={style["date-task"]}>{todo.createdAt.substr(0,10)}</div>
          <div
            className={style["item-delete"]}
            onClick={() => removeTask(todo.uuid)}
          >
            &#128465;
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
