const timeoutTask = (promise, time) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout'));
    }, time);
    promise.then(resolve, reject);
  })
);

export default timeoutTask;
