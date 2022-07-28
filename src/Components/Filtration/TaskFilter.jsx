import React from 'react';
import style from "../Filtration/TaskFilter.module.css";

const TaskFilter = ({setFilterNow, FILTERS, setSortDate, currentFilter,sortDate}) => {
    return (
        <div>
             <div className={style[`filter-button-list`]}>
        <button
          onClick={() => setFilterNow(FILTERS.ALL)}
          className={
            currentFilter === FILTERS.ALL
              ? style["data-filter-active"]
              : style["date-filter"]
          }
        >
          All
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.DONE)}
          className={
            currentFilter === FILTERS.DONE
              ? style["data-filter-active"]
              : style["date-filter"]
          }
        >
          Done
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.UNDONE)}
          className={
            currentFilter === FILTERS.UNDONE
              ? style["data-filter-active"]
              : style["date-filter"]
          }
        >
          Undone
        </button>
        <button
          className={
            !sortDate
              ? style["data-filter-active"]
              : style["date-filter"]
          }
          onClick={() => setSortDate(false)}
        >
          <span>date up</span>
        </button>
        <button
          className={
            sortDate
              ? style["data-filter-active"]
              : style["date-filter"]
          }
          onClick={() => setSortDate(true)}
        >
          <span>date down</span>
        </button>
      </div>
        </div>
    );
};

export default TaskFilter;
