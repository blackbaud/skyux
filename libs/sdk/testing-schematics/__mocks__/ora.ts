/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default function ora() {
  return {
    start: () => ({ succeed: () => {}, fail: () => {}, stop: () => {} }),
    succeed: () => {},
    fail: () => {},
    stop: () => {},
  };
}
