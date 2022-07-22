import Swal from "sweetalert2";
const SweetAlert = (error,title, text) => {
    return Swal.fire({
            background:
              "linear-gradient(149deg, rgba(27, 227, 190, 0.4) 0%, rgba(145, 76, 241, 0.4) 42%, rgba(249, 36, 200, 0.4) 72%, rgba(175, 77, 205, 0.4) 100%)",
            color: "white",
            icon: "error",
            title: title,
            text: text,
            footer: `Status code: ${error.response.status}`,})
    
}

export default SweetAlert