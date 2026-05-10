export { toast, ToastContainer } from "react-toastify"

// Compatibility shims so existing code using useToast() and setToastRef() doesn't break
import { toast as _t } from "react-toastify"
export function useToast() { return _t }
export function setToastRef() {}
export function ToastProvider({ children }) { return children }
