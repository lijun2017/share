import '../css/index.less'

var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0

// 2.3 标签模板
let x = 'Hi', y = 'Kevin';
var res = message`${x}, I am ${y}`;
console.log(res); // Hi, I am Kevin

// literals 文字
// 注意在这个例子中 literals 的第一个元素和最后一个元素都是空字符串
function message (literals, ...values) {
    console.log(literals); // [ "", ", I am ", "" ]
    console.log(values[0]); // Hi
    console.log(values[1]); // Kevin
    let result = literals.reduce((prev, next, i) => {
        let value = values[i - 1];
        return prev + value + next;
    });

    return result;
}

const obj = {
    toString () {
        return 'abc';
    }
};
const sym = Symbol(obj);
console.log(sym); // Symbol(abc)
