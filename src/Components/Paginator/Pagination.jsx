import style from "./Pagination.module.css";

function PaginationButtons({ i, selectedPage, currentPage }) {
  return (
    <button
      onClick={() => selectedPage(i)}
      className={
        currentPage === i ? `${style["active-page"]}` : `${style["page-link"]}`
      }
    >
      {i}
    </button>
  );
}

export default PaginationButtons;
