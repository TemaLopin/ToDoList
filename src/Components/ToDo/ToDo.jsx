import style from "./ToDo.module.css";

const ToDo = ({
  userInput,
  setUserInput,
  todo,
  changeTaskStatus,
  removeTask,
  editTaskName,
  taskStateChangeByUuid,
  setTaskStateChangeByUuid,
}) => {
  const keyPress = (event, id) => {
    switch (event.key) {
      case "Enter":
        editTaskName(id);
        setTaskStateChangeByUuid(null);
        setUserInput("");
        break;
      case "Escape":
        setTaskStateChangeByUuid(null);
        setUserInput('')
        break;
      default:
        break;
    }
  };

  const blurInput = () => {
    setTaskStateChangeByUuid(null);
    setUserInput('')
  };

  const changeStatusInput = (id) => {
    setUserInput(todo.name);
    setTaskStateChangeByUuid(id);
  };
  const handleChange = (event) => {
    setUserInput(event.currentTarget.value);
  };

  return (
    <div key={todo.id} className={style["item-todo"]}>
      <div className={style["task-block"]}onDoubleClick={()=> changeStatusInput(todo.uuid)}>
        <div className={style["left-side"]} >
          <div onClick={() => changeTaskStatus(todo.uuid, todo.done)}>
            {todo.done ? <span>&#10006;</span> : <span>&#10004;</span>}
          </div>
          <div
            className={
              todo.done
                ? `${`${style["item-text"]} ${style["strike"]}`}`
                : style["item-text"]
            }
          >
            {taskStateChangeByUuid === todo.uuid ? (
              <input
                className={style["editTask"]}
                autoFocus
                placeholder={todo.name}
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
              >
                {todo.name}
              </div>
            )}
          </div>
        </div>
        <div className={style["right-side"]}>
          <div className={style["date-task"]}>
            {todo.updateAt.substring(0,10)}
          </div>
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
