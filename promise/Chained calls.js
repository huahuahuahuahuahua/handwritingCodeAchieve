class MyPromise {
  constructor(execute) {
    //初始promise状态
    this.state = "pending";
    //result为保存promise结果值
    this.result = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
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
    //遍历每一个保存的失败回调并调用再删除
    while (this.onResolvedCallbacks.length > 0) {
      this.onResolvedCallbacks.shift()();
    }
  };
  reject = (reason) => {
    if (this.state == "pending") {
      this.state = "rejected";
      this.result = reason;
    }
    //遍历每一个保存的失败回调并调用再删除
    while (this.onRejectedCallbacks.length > 0) {
      this.onRejectedCallbacks.shift()();
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
    const MyPromise2 = new MyPromise((resolve, reject) => {
      try {
        setTimeout(() => {
          //状态为fulfilled则执行成功回调
          if (this.state === "fulfilled") {
            //x获取onResolve的返回值
            let x = onResolve(this.result);
            //调用ResolvePromise并传入返回值x、resolve、reject与MyPromise2
            ResolvePromise(x, resolve, reject, MyPromise2);
          }
          //状态为rejected则执行失败回调
          else if (this.state === "rejected") {
            //x获取onReject的返回值
            let x = onReject(this.result);
            ResolvePromise(x, resolve, reject, MyPromise2);
          }
          //当状态为pending时则保存onResolve与onReject
          else if (this.state === "pending") {
            this.onResolvedCallbacks.push(() => {
              let x = onResolve(this.result);
              ResolvePromise(x, resolve, reject, MyPromise2);
            });

            this.onRejectedCallbacks.push(() => {
              let x = onReject(this.result);
              ResolvePromise(x, resolve, reject, MyPromise2);
            });
          }
        }, 0);

        const ResolvePromise = (x, resolve, reject, promise2) => {
          if (x === promise2) {
            throw new Error("不能返回自身");
          }
          //如果x是MyPromise实例，则使用.then方法来获取MyPromise的结果
          if (x instanceof MyPromise) {
            x.then(
              (res) => {
                resolve(res);
              },
              (err) => {
                reject(err);
              }
            );
          } else {
            resolve(x);
          }
        };
      } catch (error) {
        reject(error);
        throw new Error(err);
      }
    });
    return MyPromise2;
  }
}

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 0);
})
  .then((value) => {
    console.log(value);
    return 200;
  })
  .then((value) => {
    console.log(value);
    return new MyPromise((resolve, reject) => {
      reject(300);
    });
  })
  .then(
    (value) => {},
    (reason) => {
      console.log(reason);
    }
  );
