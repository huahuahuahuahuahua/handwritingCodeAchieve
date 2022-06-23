class EventBus {
  constructor() {
    this.eventObj = {};
    this.callbackId = 0; // 每个函数的ID
  }
  $on(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = {};
    }
    // 定义当前回调函数id
    const id = this.callbackId++;
    this.eventObj[name][id] = callback; // 以键值对的形式存储回调函数
    return id; // 将id返回出去，可以利用该id取消订阅
  }
  $emit(name, ...args) {
    const eventList = this.eventObj[name];
    for (const id in eventList) {
      eventList[id](...args);
      // 如果是订阅一次，则删除
      if (id.indexOf("D") !== -1) {
        delete eventList[id];
      }
    }
  }
  $once(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = {};
    }
    // 定义当前回调函数id
    const id = "D" + this.callbackId++;
    this.eventObj[name][id] = callback; // 以键值对的形式存储回调函数
    return id; // 将id返回出去，可以利用该id取消订阅
  }
  $off(name, id) {
    delete this.eventObj[name][id];
    console.info(`id为${id}的事件已被取消订阅`);
    if (!Object.keys(this.eventObj[name]).length) {
      delete this.eventObj[name];
    }
  }
}

let EB = new EventBus();
EB.$on("key1", (name, age) => {
  console.info("我是订阅事件A:", name, age);
});
EB.$once("key1", (name, age) => {
  console.info("我是订阅事件B:", name, age);
});
EB.$on("key3", (name) => {
  console.info("我是订阅事件3", name);
});

// 发布事件
EB.$emit("key1", "小猪课堂", 26);
// 取消订阅事件
// EB.$off("key1", id);
console.info("在触发一次key1");
EB.$emit("key1", "小猪课堂", 26);
EB.$emit("key3", "小猪课堂");
