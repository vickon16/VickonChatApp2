
export const errorHandler = (stateFunc, message) => {
  stateFunc(message);
  setTimeout(() => stateFunc(""), 4000)
}