import {
  addStringNoLocale,
  createThing,
  getSolidDataset,
  createSolidDataset,
  saveSolidDatasetAt,
  setThing,
  addDatetime,
  removeDatetime,
  getDatetime,
  removeThing,
} from "@inrupt/solid-client";
import { schema, cal } from "rdf-namespaces";

export function createTodo(content) {
  const todo = addStringNoLocale(createThing(), schema.text, content);
  return addDatetime(todo, cal.created, new Date());
}

export async function addTodoToList(iri, todoDataset, todo, fetch) {
  const dataset = await setThing(todoDataset, todo, { fetch });
  const updatedDataset = await saveSolidDatasetAt(iri, dataset, {
    fetch,
  });
  return updatedDataset;
}

export async function initializeTodos(fetch, iri) {
  try {
    const dataset = createSolidDataset();
    const initializedDataset = await saveSolidDatasetAt(iri, dataset, {
      fetch,
    });
    return initializedDataset;
  } catch (error) {
    console.log(error);
  }
}

export async function populateTodos(dataset, iri, fetch) {
  const initialTodos = [
    "Nothing is impossible",
    "Yesterday you said tomorrow",
    "Don't let your dreams be dreams",
    "The more often you do it, the more light there will be",
  ].map((todo, index) => {
    const date = Date.now() + 1000 * index;
    const todoThing = addStringNoLocale(createThing(), schema.text, todo);
    return addDatetime(todoThing, cal.created, new Date(date));
  });

  const dataset1 = await addTodoToList(iri, dataset, initialTodos[0], fetch);
  const dataset2 = await addTodoToList(iri, dataset1, initialTodos[1], fetch);
  const dataset3 = await addTodoToList(iri, dataset2, initialTodos[2], fetch);
  const dataset4 = await addTodoToList(iri, dataset3, initialTodos[3], fetch);
  const populatedDataset = await saveSolidDatasetAt(iri, dataset4, {
    fetch,
  });
  return populatedDataset;
}

export async function getTodos(session, iri, setInitializeMessage) {
  const { fetch } = session;
  try {
    const dataset = await getSolidDataset(iri, { fetch });
    return dataset;
  } catch (error) {
    console.log(error);
    if (error.message.includes("404")) {
      setInitializeMessage(true);
      const dataset = await initializeTodos(fetch, iri);
      setInitializeMessage(false);
      return dataset;
    } else {
      console.log(error);
    }
  }
}

export async function setDone(todo, dataset, todosIri, fetch) {
  const date = new Date();
  const doneTodo = addDatetime(todo, cal.completed, date);
  const updatedTodos = setThing(dataset, doneTodo, { fetch });
  const updatedDataset = await saveSolidDatasetAt(todosIri, updatedTodos, {
    fetch,
  });
  return updatedDataset;
}

export async function setUndone(todo, dataset, todosIri, fetch) {
  const date = getDatetime(todo, cal.completed);
  const undoneTodo = removeDatetime(todo, cal.completed, date);
  const updatedTodos = setThing(dataset, undoneTodo, { fetch });
  const updatedDataset = await saveSolidDatasetAt(todosIri, updatedTodos, {
    fetch,
  });
  return updatedDataset;
}

export async function removeTodo(todo, todosIri, dataset, fetch) {
  const updateTodos = removeThing(dataset, todo);
  const updatedDataset = await saveSolidDatasetAt(todosIri, updateTodos, {
    fetch,
  });
  return updatedDataset;
}
