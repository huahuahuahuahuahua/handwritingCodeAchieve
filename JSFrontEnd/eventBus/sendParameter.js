class EventBus {
  constructor() {
    this.eventObj = {};
  }
  $on(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = [];
    }
    this.eventObj[name].push(callback);
  }
  $emit(name, ...args) {
    const eventList = this.eventObj[name];
    for (const callback of eventList) {
      callback(...args);
    }
  }
}

let EB = new EventBus();
EB.$on("key1", (name, age) => {
  console.info("我是订阅事件A:", name, age);
});
EB.$on("key2", (name, age) => {
  console.info("我是订阅事件2", name, age);
});
EB.$on("key3", (name) => {
  console.info("我是订阅事件3", name);
});

// 发布事件
EB.$emit("key1", "小猪课堂", 26);
EB.$emit("key2", "小猪课堂", 26);
EB.$emit("key3", "小猪课堂");
