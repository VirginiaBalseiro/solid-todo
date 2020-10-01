import React, { useState } from "react";
import { createTodo, addTodoToList } from "../utils";
import { useSession } from "@inrupt/solid-ui-react";

export default function AddTodoForm({ todoDataset, containerIri, setTodos }) {
  const { session } = useSession();
  const { fetch } = session;
  const [todoContent, setTodoContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const todo = createTodo(todoContent);
    const updatedDataset = await addTodoToList(
      containerIri,
      todoDataset,
      todo,
      fetch
    );
    setTodos(updatedDataset);
    setTodoContent("");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTodoContent(e.target.value);
  };

  return (
    <>
      <form className="todo-input-container" onSubmit={handleSubmit}>
        <label htmlFor="todo-input" className="todo-input-label">
          <input
            className="todo-input"
            type="text"
            value={todoContent}
            onChange={handleChange}
          />
        </label>
        <button className="add-btn" type="submit">
          <i className="fas fa-plus"></i>
        </button>
      </form>
    </>
  );
}
