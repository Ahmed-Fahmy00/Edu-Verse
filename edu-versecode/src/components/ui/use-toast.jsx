// This file provides a React hook and context for toast notifications
import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

const ActionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map();

function addToRemoveQueue(toastId) {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: ActionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}

const ToastContext = React.createContext(undefined);

function toastReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_TOAST:
      return [action.toast, ...state].slice(0, TOAST_LIMIT);
    case ActionTypes.UPDATE_TOAST:
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
    case ActionTypes.DISMISS_TOAST:
      if (action.toastId) addToRemoveQueue(action.toastId);
      else state.forEach((t) => addToRemoveQueue(t.id));
      return state.map((t) =>
        t.id === action.toastId || action.toastId === undefined
          ? { ...t, open: false }
          : t
      );
    case ActionTypes.REMOVE_TOAST:
      return state.filter((t) => t.id !== action.toastId);
    default:
      return state;
  }
}

const listeners = [];
let memoryState = [];

function dispatch(action) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [state]);
  return {
    ...state,
    toast: {
      create: (props) => {
        const id = genId();
        dispatch({
          type: ActionTypes.ADD_TOAST,
          toast: { ...props, id, open: true },
        });
        return id;
      },
      dismiss: (toastId) =>
        dispatch({ type: ActionTypes.DISMISS_TOAST, toastId }),
      update: (toast) => dispatch({ type: ActionTypes.UPDATE_TOAST, toast }),
    },
  };
}

export { useToast, ToastContext };
