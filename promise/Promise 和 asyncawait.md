# Promise

一句话介绍 Promise ：**Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值（MDN）。**

Promise 的出现解决了什么问题：在传统的异步编程中，如果异步之间存在依赖关系，我们就需要通过层层嵌套回调来满足这种依赖，如果嵌套层数过多，可读性和可维护性都变得很差，产生所谓“回调地狱”，而Promise将回调嵌套改为链式调用，增加可读性和可维护性。

## 1 观察者模式

来看个简单 Promise 的使用例子

```javascript
const p1 = new Promise((resolve, reject) => {
    console.log(1)
    setTimeout(() => {
      resolve()
      console.log(2)
    }, 1000)
    console.log(3)
}).then(() => {
  console.log(4)
})
console.log(5)
p1.then(res => console.log(6))
```
大致的流程：

* Promise 的构造方法接收一个执行函数 executor() ，在 new Promise() 时就立刻执行这个 executor 回调
* executor() 内部的异步任务被放入宏/微任务队列，等待执行
* then() 被执行，收集成功/失败回调，放入成功/失败队列
* executor() 的异步任务被执行，触发 resolve/reject，从成功/失败队列中取出回调依次执行

这边涉及到事件循环，有兴趣的自己了解，不多做深入。

**观察者模式**：这种收集依赖 -> 触发通知 -> 取出依赖执行

在 Promise 中其实就是 then收集依赖 -> 异步触发resolve -> resolve执行依赖

依据上面的介绍，我们来尝试构造出 Promise 的大致模样。我看的文档是用 class 类来模拟的，其实也可以通过 Function 实现。

```javascript
class MyPromise {
    // 构造方法接收一个回调
    constructor(executor) {
      this._resolveQueue = [] // then收集的执行成功的回调队列
      this._rejectQueue = [] // then收集的执行失败的回调队列
      // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
      let _resolve = (val) => {
          // 从成功队列里取出回调依次执行
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift()
            callback(val)
          }
      }
      // 实现同resolve 
      let _reject = (val) => {
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift()
            callback(val)
          }
        }
        // new Promise()时立即执行executor,并传入resolve和reject 
        executor(_resolve, _reject)
      }
      // then方法,接收一个成功的回调和一个失败的回调，并push进对应队列 
      then(resolveFn, rejectFn) {
        this._resolveQueue.push(resolveFn)
        this._rejectQueue.push(rejectFn)
      }
}
```
这边大家可以考虑一下，为什么失败和成功的回调是队列（数组）？
然后我们测试上面的例子，发现报错了，而且感觉顺序好像也有问题。

![图片](https://uploader.shimo.im/f/grwJwVLtMbKlNVrO.png!thumbnail)

不要急，这是因为我们的 Promise 是个超级简化的版本，很多细节都没有，后面我们慢慢介绍。

## 2 Promise A+规范

Promise 的规范有很多，但是 ES6 采用的是 Promise/A+ 规范。

英文地址：[https://promisesaplus.com/](https://promisesaplus.com/)

中文地址：[https://www.ituring.com.cn/article/66566](https://www.ituring.com.cn/article/66566)

Promise/A+ 的规范比较长，这里只总结两条核心规则：


1. 一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected），状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆。
2. then方法接收两个可选参数，分别对应状态改变时触发的回调。then方法返回一个 Promise 。then 方法可以被同一个 Promise 调用多次。

我们来补充一下这两条规则

```javascript
//Promise/A+规范的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
      // 构造方法接收一个回调
      constructor(executor) {
        this._status = PENDING  // Promise状态
        this._resolveQueue = [] // 成功队列, resolve时触发 
        this._rejectQueue = []  // 失败队列, reject时触发
        // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
        let _resolve = (val) => {
          if (this._status !== PENDING) return  // 对应规范中的"状态只能由pending到fulfilled或rejected"
          this._status = FULFILLED  // 变更状态
          // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次",
          // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调，上面思考题的答案
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift()
            callback(val)
          }
        }
        // 实现同resolve 
        let _reject = (val) => {
          if (this._status !== PENDING) return  // 对应规范中的"状态只能由pending到fulfilled或rejected"
          this._status = REJECTED  // 变更状态
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift()
            callback(val)
          }
        }
        // new Promise()时立即执行executor,并传入resolve和reject 
        executor(_resolve, _reject)
      }
      // then方法,接收一个成功的回调和一个失败的回调，并push进对应队列 
      then(resolveFn, rejectFn) {
        this._resolveQueue.push(resolveFn)
        this._rejectQueue.push(rejectFn)
      }
    }
```
如果我们继续测试上面的例子，发现依然报错，思考为什么呢？
## 3 then 的链式调用

先来看个简单的例子

```javascript
const p1 = new Promise((resolve, reject) => {
  resolve(1)
})
p1.then(res => {
    console.log(res)
    //then回调中可以return一个Promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(2)
      }, 1000);
    })
  })
  .then(res => {
    console.log(res)
    //then回调中也可以return一个值
    return 3
  })
  .then(res => {
    console.log(res)
  })
// 1
// 2 并且是1秒后才输出的
// 3
```
我们思考一下这个链式调用，可以想一下为什么可以一直链式调用

1. 显然 .then() 需要返回一个 Promise ，这样才能找到 then 方法，所以我们会把 then 方法的返回值包装成 Promise ，2.2.7 then必须返回一个promise。
2. .then() 的回调需要拿到上一个 .then() 的返回值， 2.2.6 then方法可能被多次调用。
3. .then() 的回调需要顺序执行，以上面这段代码为例，虽然中间return了一个Promise，但执行顺序仍要保证是1->2->3。我们要等待当前Promise状态变更后，再执行下一个then收集的回调，这就要求我们对then的返回值分类讨论
```javascript
// then方法,接收一个成功的回调和一个失败的回调
then(resolveFn, rejectFn) {
      //return一个新的promise
      return new MyPromise((resolve, reject) => {
        //把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            //执行第一个(当前的)Promise的成功回调,并获取返回值
            let x = resolveFn(value)
            //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
            //这里resolve之后，就能被下一个.then()的回调获取到返回值，从而实现链式调用
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }
        //把后续then收集的依赖都push进当前Promise的成功回调队列中(_rejectQueue), 这是为了保证顺序调用
        this._resolveQueue.push(fulfilledFn)
        //reject同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error)
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }
        this._rejectQueue.push(rejectedFn)
      })
```
## 4 值穿透 & 状态已变更的情况

对于 then() 方法，我们还要两个细节需要处理一下：


1. 值穿透：根据规范 PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4，如果 then() 接收的参数不是function，那么我们应该忽略它。如果没有忽略，当then()回调不为function时将会抛出异常，导致链式调用中断
2. 处理状态为resolve/reject的情况：其实我们上边 then() 的写法是对应状态为padding的情况，但是有些时候，resolve/reject 在 then() 之前就被执行（比如Promise.resolve().then()），如果这个时候还把then()回调push进resolve/reject的执行队列里，那么回调将不会被执行，因此对于状态已经变为fulfilled或rejected的情况，我们直接执行then回调：
```javascript
// then方法,接收一个成功的回调和一个失败的回调，并push进对应队列 
then(resolveFn, rejectFn) {
      // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行 PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
      typeof resolveFn !== 'function' ? resolveFn = value => value : null
      typeof rejectFn !== 'function' ? rejectFn = reason => {
        throw new Error(reason instanceof Error ? reason.message : reason);
      } : null
      //return一个新的promise
      return new MyPromise((resolve, reject) => {
        //把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            //执行第一个(当前的)Promise的成功回调,并获取返回值
            let x = resolveFn(value)
            //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
            //这里resolve之后，就能被下一个.then()的回调获取到返回值，从而实现链式调用
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }
        //reject同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error)
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }
        switch (this._status) {
       // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
          case PENDING:
            this._resolveQueue.push(fulfilledFn)
            this._rejectQueue.push(rejectedFn)
            break;
          // 当状态已经变为resolve/reject时,直接执行then回调
          case FULFILLED:
            fulfilledFn(this._value)    // this._value是上一个then回调return的值(见完整版代码)
            break;
          case REJECTED:
            rejectedFn(this._value)
            break;
        }
      })
    }
```
## 5 兼容同步任务

本文一开始就说明了，Promise的执行顺序是 new Promise -> then() 收集回调 -> resolve/reject 执行回调，但是如果**executor**是同步任务，顺序就会变成new Promise -> resolve/reject执行回调 -> then()收集回调，resolve的执行跑到then之前去了，会导致 Promise 的状态变化，后续的回调都不会执行，因此，我们需要将同步任务也包装成异步任务，给resolve/reject执行回调的操作包一个setTimeout，让它异步执行，保证执行顺序。

```javascript
//Promise/A+规范的三种状态
  const PENDING = 'pending'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'
  class MyPromise {
    // 构造方法接收一个回调
    constructor(executor) {
      this._status = PENDING  // Promise状态
      this._value = undefined    // 储存then回调return的值
      this._resolveQueue = [] // 成功队列, resolve时触发 
      this._rejectQueue = []  // 失败队列, reject时触发
      // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
      let _resolve = (val) => {
        const run = (val) => {
          if (this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
          this._status = FULFILLED              // 变更状态
          this._value = val                     // 储存当前value
          // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
          // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift()
            callback(val)
          }
        }
        setTimeout(run)
      }
      // 实现同resolve 
      let _reject = (val) => {
        const run = (val) => {
          if (this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
          this._status = REJECTED              // 变更状态
          this._value = val                     // 储存当前value
          // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
          // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift()
            callback(val)
          }
        }
        setTimeout(run)
      }
      // new Promise()时立即执行executor,并传入resolve和reject 
      executor(_resolve, _reject)
    }
    // then方法,接收一个成功的回调和一个失败的回调，并push进对应队列 
    then(resolveFn, rejectFn) {
      // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行 PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
      typeof resolveFn !== 'function' ? resolveFn = value => value : null
      typeof rejectFn !== 'function' ? rejectFn = reason => {
        throw new Error(reason instanceof Error ? reason.message : reason);
      } : null
      //return一个新的promise PromiseA+ 2.2.7
      return new MyPromise((resolve, reject) => {
        //把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            //执行第一个(当前的)Promise的成功回调,并获取返回值
            let x = resolveFn(value)
            //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
            //这里resolve之后，就能被下一个.then()的回调获取到返回值，从而实现链式调用
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }
        //reject同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error)
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
          } catch (error) {
            reject(error)
          }
        }
        switch (this._status) {
          // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
          case PENDING:
            this._resolveQueue.push(fulfilledFn)
            this._rejectQueue.push(rejectedFn)
            break;
          // 当状态已经变为resolve/reject时,直接执行then回调
          case FULFILLED:
            fulfilledFn(this._value)    // this._value是上一个then回调return的值(见完整版代码)
            break;
          case REJECTED:
            rejectedFn(this._value)
            break;
        }
      })
    }
  }
```
## 6 Promise的其他方法

### Promise.prototype.catch()

```javascript
// catch()方法返回一个Promise，并且处理拒绝的情况。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同。
catch(rejectFn) {
  return this.then(undefined, rejectFn)
}
```
### Promise.resolve()

```javascript
//Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。如果该值为promise，返回这个promise；如果这个值是thenable（即带有"then" 方法)），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平。
static resolve(value) {
  if(value instanceof MyPromise) return value // 根据规范, 如果参数是Promise实例, 直接return这个实例 
  return new MyPromise(resolve => resolve(value))
}
```
### Promise.reject()

```javascript
// Promise.reject()方法返回一个带有拒绝原因的Promise对象。
static reject(reason) {
  return new MyPromise((resolve, reject) => reject(reason))
}
```
### Promise.all()

```javascript
// Promise.all(iterable)方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。
static all(promiseArr) {
  let index = 0
  let result = []
  return new MyPromise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      //Promise.resolve(p)用于处理传入值不为Promise的情况
      MyPromise.resolve(p).then(
        val => {
          index++
          result[i] = val
          //所有then执行后, resolve结果
          if (index === promiseArr.length) {
            resolve(result)
          }
        },
        err => {
          //有一个Promise被reject时，MyPromise的状态变为reject
          reject(err)
        }
      )
    })
  })
}
```
### Promise.race()

```javascript
static race(promiseArr) {
  return new MyPromise((resolve, reject) => {
    // 同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
    for (let p of promiseArr) {
      // Promise.resolve(p)用于处理传入值不为Promise的情况
      MyPromise.resolve(p).then(value => {
        // 注意这个resolve是上边new MyPromise的
        resolve(value)
      }, err => {
        reject(err)
      })
    }
  })
}
```
# async/await

Promise 通过链式调用取代了回调嵌套，但过多的链式调用可读性仍然不佳，流程控制也不方便，ES7 提出的 async 函数，终于让 JS 对于异步操作有了终极解决方案，简洁优美地解决了以上两个问题。

```javascript
Promise.resolve(a)
  .then(b => {
    // do something
  })
  .then(c => {
    // do something
  })
  
async () => {
  const a = await Promise.resolve(a);
  const b = await Promise.resolve(b);
  const c = await Promise.resolve(c);
}
```
async/await实际上是对Generator（生成器）的封装，是一个语法糖。
## Generator

Generator 函数，可以通过 yield 关键字，把函数的执行流挂起，通过next()方法可以切换到下一个状态，为改变执行流程提供了可能，从而为异步编程提供解决方案。

```javascript
function* myGenerator() {
  yield '1'
  yield '2'
  return '3'
}
const gen = myGenerator();  // 获取迭代器
gen.next()  //{value: "1", done: false}
gen.next()  //{value: "2", done: false}
gen.next()  //{value: "3", done: true}
```
*/yield 和 async/awai t看起来其实已经很相似了，它们都提供了暂停执行的功能，但二者又有三点不同：

1. async/await自带执行器，不需要手动调用next()就能自动执行下一步
2. async函数返回值是Promise对象，而Generator返回的是生成器对象
3. await能够返回Promise的resolve/reject的值
## 自动执行

```javascript
function* myGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}
// 手动执行迭代器
const gen = myGenerator()
gen.next().value.then(val => {
  console.log(val)
  gen.next().value.then(val => {
    console.log(val)
    gen.next().value.then(val => {
      console.log(val)
    })
  })
})
```
看着很难受是吧，那我们来封装模拟，让它自动执行
```javascript
function run(gen) {
    var g = gen()                     //由于每次gen()获取到的都是最新的迭代器,因此获取迭代器操作要放在_next()之前,否则会进入死循环

    function _next(val) {             //封装一个方法, 递归执行g.next()
      var res = g.next(val)           //获取迭代器对象，并返回resolve的值
      if (res.done) return res.value   //递归终止条件
      res.value.then(val => {         //Promise的then方法是实现自动迭代的前提
        _next(val)                    //等待Promise完成就自动执行下一个next，并传入resolve的值
      })
    }
    _next()  //第一次执行
  }
run(myGenerator)
```
## 返回 Promise & 异常处理


1. 需要兼容基本类型：这段代码能自动执行的前提是yield后面跟Promise，为了兼容后面跟着基本类型值的情况，我们需要把yield跟的内容(gen().next.value)都用Promise.resolve()转化一遍
2. 缺少错误处理：上边代码里的Promise如果执行失败，就会导致后续执行直接中断，我们需要通过调用Generator.prototype.throw()，把错误抛出来，才能被外层的try-catch捕获到
3. 返回值是Promise：async/await的返回值是一个Promise，我们这里也需要保持一致，给返回值包一个Promise
```javascript
function run(gen) {
    //把返回值包装成promise
    return new Promise((resolve, reject) => {
      var g = gen()
      function _next(val) {
        //错误处理
        try {
          var res = g.next(val)
        } catch (err) {
          return reject(err);
        }
        if (res.done) {
          return resolve(res.value);
        }
        //res.value包装为promise，以兼容yield后面跟基本类型的情况
        Promise.resolve(res.value).then(
          val => {
            _next(val);
          },
          err => {
            //抛出错误
            g.throw(err)
          });
      }
      _next();
    });
  }
  function* myGenerator() {
    try {
      console.log(yield Promise.resolve(1))
      console.log(yield 2)   //2
      console.log(yield Promise.reject('error'))
    } catch (error) {
      console.log(error)
    }
  }
  const result = run(myGenerator)     //result是一个Promise
//输出 1 2 error
```
本文参考链接：[https://juejin.im/post/6844904096525189128#heading-20](https://juejin.im/post/6844904096525189128#heading-20)

function实现即翻译链接：[https://juejin.im/post/6844903796129136654#heading-26](https://juejin.im/post/6844903796129136654#heading-26)

