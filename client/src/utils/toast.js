import { toast } from "react-toastify";

export const showToast = (content, type = "info", onClose, options = {}) => {
  toast[type](content, {
    position: "top-right",
    autoClose: type === "error" ? 2000 : 1000,
    theme: "colored",
    onClose,
    ...options,
  });
};
