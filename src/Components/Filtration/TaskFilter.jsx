import React from 'react';
import style from "../Filtration/TaskFilter.module.css";

const TaskFilter = ({setFilterNow, FILTERS, setSortDate, filterNow}) => {
    return (
        <div>
             <div className={style[`filter-button-list`]}>
        <button
          onClick={() => setFilterNow(FILTERS.ALL)}
          className={
            filterNow === FILTERS.ALL
              ? style["data-filter-active"]
              : style["date-filter"]
          }
        >
          All
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.DONE)}
          className={
            filterNow === FILTERS.DONE
              ? style["data-filter-active"]
              : style["date-filter"]
          }
        >
          Done
        </button>
        <button
          onClick={() => setFilterNow(FILTERS.UNDONE)}
          className={
            filterNow === FILTERS.UNDONE
              ? style["data-filter-active"]
              : style["date-filter"]
          }
        >
          Undone
        </button>
        <button
          className={
            filterNow === FILTERS.BACK_DATE
              ? style["data-filter-active"]
              : style["date-filter"]
          }
          onClick={() => setSortDate(false)}
        >
          <span>date up</span>
        </button>
        <button
          className={
            filterNow === FILTERS.FORWARD_DATE
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
