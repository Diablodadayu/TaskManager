const fs = require("fs");

try {
let data = fs.readFileSync("./public");
console.log(data);
} catch(e) {
    console.log("111", e.message);
}

fs.readFile("tasks.json", "utf-8", (err, data)=>{
    console.log(JSON.parse(data));
})

let obj = {
    a: 1,
    b: "2",
    c: 3
}

let obj2 = {a, b} = obj;
console.log(obj2);

console.log("a".includes(""))