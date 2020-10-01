import React, { useEffect, useState } from "react";
import { Table, TableColumn, useSession } from "@inrupt/solid-ui-react";
import {
  getThingAll,
  getThing,
  asUrl,
  addStringNoLocale,
  getDatetime,
} from "@inrupt/solid-client";
import {
  getTodos,
  populateTodos,
  removeTodo,
  setDone,
  setUndone,
} from "../utils";
import AddTodoForm from "./AddTodoForm";
import { schema, cal } from "rdf-namespaces";

const handleCheck = (dataset, todoIri, todosIri, setTodos, done, fetch) => {
  return async () => {
    if (!done) {
      const todo = getThing(dataset, todoIri, { fetch });
      const updatedDataset = await setDone(todo, dataset, todosIri, fetch);
      setTodos(updatedDataset);
    } else {
      const todo = getThing(dataset, todoIri, { fetch });
      const updatedDataset = await setUndone(todo, dataset, todosIri, fetch);
      setTodos(updatedDataset);
    }
  };
};

export default function TodoList() {
  const { session } = useSession();
  const [todos, setTodos] = useState();
  const root = new URL(session.info.webId).origin + "/";
  const todosContainerIri = root + "todos/index.ttl";

  const handleDelete = async (todoIri) => {
    const todo = getThing(todos, todoIri);
    const updatedDataset = await removeTodo(
      todo,
      todosContainerIri,
      todos,
      session.fetch
    );
    setTodos(updatedDataset);
  };

  const handlePopulateTodos = async () => {
    const populatedDataset = await populateTodos(
      todos,
      todosContainerIri,
      session.fetch
    );
    setTodos(populatedDataset);
  };

  useEffect(() => {
    (async () => {
      const todosDataset = await getTodos(session, todosContainerIri);
      setTodos(todosDataset);
    })();
  }, [setTodos, session, todosContainerIri]);

  if (!todos) {
    return null;
  }

  if (todos.quads.size === 0) {
    return (
      <div className="populate-message">
        Do you want to add some todos?
        <p>You can delete them later.</p>
        <button onClick={handlePopulateTodos} className="populate-btn">
          Click here
        </button>
      </div>
    );
  }

  const things = getThingAll(todos)
    .sort(
      (a, b) =>
        getDatetime(a, cal.created).getMilliseconds() -
        getDatetime(b, cal.created).getMilliseconds()
    )
    .map((t) => {
      const thing = addStringNoLocale(t, schema.url, asUrl(t));
      return {
        thing,
        dataset: todos,
      };
    });

  return (
    <div className="todos-container">
      <Table things={things}>
        <TableColumn
          property={schema.text}
          header=""
          body={({ row, value }) => {
            const isDone = Boolean(row.original.col1);
            return (
              <p className={`todo-text  ${isDone ? "done" : "active"}`}>
                {value}
              </p>
            );
          }}
        />
        <TableColumn
          header="JUST DO IT!"
          property={cal.completed}
          dataType="datetime"
          body={({ row, value }) => {
            const isDone = Boolean(value);
            const url = row.original.col2;
            return (
              <label className="done-container">
                <input
                  className="done-checkbox"
                  type="checkbox"
                  checked={isDone}
                  onChange={handleCheck(
                    todos,
                    url,
                    todosContainerIri,
                    setTodos,
                    isDone,
                    session.fetch
                  )}
                />
                <span className="done-checkmark"></span>
              </label>
            );
          }}
        />
        <TableColumn
          property={schema.url}
          header=""
          body={({ value }) => {
            return (
              <button
                className="delete-btn"
                onClick={() => handleDelete(value)}
              >
                <i className="fas fa-trash"></i>
              </button>
            );
          }}
        />
      </Table>
      <AddTodoForm
        todoDataset={todos}
        containerIri={todosContainerIri}
        setTodos={setTodos}
      />
    </div>
  );
}
