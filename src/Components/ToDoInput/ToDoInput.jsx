import style from "./ToDoInput.module.css";

function ToDoForm({ addTask, userInput, setUserInput }) {
  const handleChange = (e) => {
    setUserInput(e.currentTarget.value);
  };

  const submitTodo = (e) => {
    addTask(userInput);
    setUserInput("");
  };

  const keyPress = (e) => {
    if (e.key === "Enter") {
      submitTodo(e);
    }
  };

  return (
    <div className={style["todo-input"]} onSubmit={submitTodo}>
      <input
        value={userInput}
        type="text"
        className={style["input"]}
        onChange={handleChange}
        onKeyDown={keyPress}
        placeholder="I want to do..."
      />
      <button onClick={submitTodo} className={style["button-save-task"]}>
        SAVE{" "}
      </button>
    </div>
  );
}

export default ToDoForm;
