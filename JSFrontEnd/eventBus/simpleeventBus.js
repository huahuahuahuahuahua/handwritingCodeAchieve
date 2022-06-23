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
  $emit(name) {
    const eventList = this.eventObj[name];
    for (const callback of eventList) {
      callback();
    }
  }
}

let EB = new EventBus();
EB.$on("key1", () => {
  console.info("我是订阅事件1");
});
EB.$on("key2", () => {
  console.info("我是订阅事件2");
});
EB.$on("key3", () => {
  console.info("我是订阅事件3");
});

// 发布事件
EB.$emit("key1");
EB.$emit("key2");
