import { enqueueSnackbar } from "notistack";

export const SUCCESS = {
    variant: "success",
    autoHideDuration: 3000,
    anchorOrigin: { vertical: "top", horizontal: "right" }
}

export const ERROR = {
    variant: "error",
    autoHideDuration: 3000,
    anchorOrigin: { vertical: "top", horizontal: "right" }
}

export const notifyError = (message) => {
    enqueueSnackbar(message, ERROR);
}

export const notifySuccess = (message) => {
    enqueueSnackbar(message, SUCCESS);
}