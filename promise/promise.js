class MyPromise {
  constructor(execute) {
    //初始promise状态
    this.state = "pending";
    //result为保存promise结果值
    this.result = null;
    try {
      execute(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }
  resolve = (value) => {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.result = value;
    }
  };
  reject = (reason) => {
    if (this.state == "pending") {
      this.state = "rejected";
      this.result = reason;
    }
  };
  then(onResolve, onReject) {
    onResolve = typeof onResolve === "function" ? onResolve : (value) => value;
    onReject =
      typeof onReject === "function"
        ? onReject
        : (reason) => {
            throw reason;
          };
    if (this.state === "fulfilled") {
      onResolve(this.result);
    } else if (this.state === "rejected") {
      onReject(this.result);
    }
  }
}

const test1 = new MyPromise((resolve, reject) => {
  resolve(100);
});
const test2 = new MyPromise((resolve, reject) => {
  reject(200);
});
console.log("test1:", test1, "test2:", test2);
test1.then(
  (value) => {
    console.log("value", value);
  },
  (reason) => {}
);
test2.then(
  (value) => {},
  (reason) => {
    console.log("reason", reason);
  }
);
