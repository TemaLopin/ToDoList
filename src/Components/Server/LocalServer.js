import axios from "axios";
import { TASK_PER_PAGE } from "../../Constant/todos";
const axiosRequest = axios.create({
  baseURL: process.env.REACT_APP_DATABASE_URL,
});

export const postTask = (userInput) =>
axiosRequest.post(`/todos`, {
    name: userInput
  });

export const deleteTask = (uuid) => axiosRequest.delete(`/todo/${uuid}`);

export const changeNameForTask = (uuid, userInput) =>
axiosRequest.patch(`/todo/${uuid}`, {
    name: userInput,
  });

export const changeDoneStatusTask = (uuid, done) =>
axiosRequest.patch(`/todo/${uuid}`, {
    done: !done
  });

export const getTasks = (currentFilter, sortDate, currentPage) =>
axiosRequest.get(`/todos`, {
    params: { 
        filterBy: currentFilter, 
        order: sortDate ? "asc" : "desc", 
        pp: TASK_PER_PAGE, 
        page: currentPage },
  });