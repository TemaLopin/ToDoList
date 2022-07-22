import axios from "axios";

const BASEDATE_URL = process.env.REACT_APP_DATABASE_URL;
const axiosInstance = axios.create({
  baseURL: BASEDATE_URL,
});

export const postTask = (userInput) =>
  axiosInstance.post(`/task/4`, {
    name: userInput,
    done: false
  });

export const deleteTask = (uuid) => axiosInstance.delete(`/task/4/${uuid}`);

export const changeNameForTask = (uuid, userInput) =>
  axiosInstance.patch(`/task/4/${uuid}`, {
    name: userInput,
  });

export const changeDoneStatusTask = (uuid, done) =>
  axiosInstance.patch(`/task/4/${uuid}`, {
    done: !done,
  });

export const getTasks = (currentFilter, sortDate, currentPage) =>
  axiosInstance.get("/tasks/4", {
    params: { 
        filterBy: currentFilter, 
        order: sortDate ? "asc" : "desc", 
        pp: 5, 
        page: currentPage },
  });