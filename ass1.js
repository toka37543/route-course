//part 1
// question 1
const str = "123";
console.log(Number(str) + 7)

// question 2
let var2 = 0;
if (!var2)
    console.log("Invalid")

// question 3
let res3 = "";
for (let i = 1; i <= 10; i += 2) {
    res3 += i + " , ";
}
console.log(res3);

// question 4
const numbers4 = [1, 2, 3, 4, 5];
const res4 = numbers4.filter(function (num) {
    return !(num % 2);
});
console.log(res4)

// question 5
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let mergedArray = [...arr1, ...arr2]
console.log(mergedArray);

// question 6
let deyNum = 2;
switch (deyNum) {
    case 1:
        dayName = "sunDay";
        break;
    case 2:
        dayName = "monDay";
        break;
    case 3:
        dayName = "tuesDay";
        break;
    case 4:
        dayName = "wednesDay";
        break;
    case 5:
        dayName = "thursDay";
        break;
    case 6:
        dayName = "friday";
        break;
    default:
        dayName = "unknown day";
}
console.log(dayName);

// question 7
const girlNames = ["a", "ab", "abc"]
const lengths = girlNames.map(name => name.length);
console.log(lengths);

// question 8

let isDivide = (num) => {
    return num % 3 === 0 && num % 5 === 0;
}
console.log("Divisible by both")

// question 9
let squareFun = (number) => number * number;
console.log(squareFun(5));


// How to knwo that the person param is an object of name and age
// question 10
function formatPerson(person) {
    const { name, age } = person;
    return `${name} is ${age} years old`;
}
const person10 = {
    name: "Toqa",
    age: 25
};
console.log(formatPerson(person10));

// question 11

function sum(...numbers) {
    return numbers.reduce((total, number) => total + number, 0);
}

console.log(sum(1, 2, 3, 4, 5));

// question 12
function getSuccess() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Success");
        }, 3000);
    });
}
getSuccess().then((message) => {
    console.log(message);
});

// question 13
function findLargest(numbers) {
    return Math.max(...numbers);
}
const numbers = [1, 3, 7, 2, 4];
console.log(findLargest(numbers));

// question 14

function getObjectKeys(object) {
    return Object.keys(object);
}

const person = {
    name: "Toqa",
    age: 30
};
console.log(getObjectKeys(person));

// question 15
function splitIntoWords(text) {
    return text.split(" ");
}
const sentence = "The quick brown fox";
console.log(splitIntoWords(sentence));


//   ------------------------------------------------------------//

//part 2
// question 1

//*for...of*
//  A built-in JavaScript loop statement,
//  supports break and continue to stop or skip iterations,
//  works perfectly with async/await (executes one by one),
// can loop through Arrays, Strings, Sets, and Maps.
//
// *forEach*
// A prototype method built strictly for arrays,
// cannot be stopped, it must run through every single item,
// automatically provides the index of each item in the callback.

// question 2

//Hoisting
// is the behavior of the JavaScript engine ,
// where memory space is allocated for variables and functions during the Creation Phase,
// before the code executes
// TDZ
// The TDZ is a runtime behavioral zone where let and const variables belong from the moment their block ,
// scope is entered until the execution line reaches the actual variable declaration.
// Accessing a variable within this zone is prohibited,
// because the memory identifier exists but lacks initialization,
// resulting in a strict ReferenceError.

// question 3

//==
// Compares two values for equality after converting them to a common type.
//
//
// ===
// Compares both the value and the type. No conversion occurs;
// if the types are different, it immediately returns false.

// question 4

//try-catch is your code's safety net. It allows you to "try" running code that might fail,
// and "catch" the error if it does, preventing your entire application from crashing.

// How try-catch Works :ـ
// It consists of two main blocks:

// try block: You place the code that might throw an error here (like parsing JSON or calling an external service).
// catch block: If an error occurs inside the try block, JavaScript immediately stops executing it ,
// and jumps straight to the catch block, passing along an error object with details about what went wrong.
//
// Why try-catch is Critical for Async/Await?

// 1. It Prevents App Crashes
// When an async operation fails (like a network timeout or a server crash),
// it rejects a Promise. Without try-catch, this causes an Unhandled Promise Rejection,
// which can crash your Node.js server or freeze your frontend UI.
// 2. Async Errors Don't Wait
// Async code runs outside the normal execution flow. Standard error handling cannot see async errors.
// try-catch combined with await pauses execution and forces the error back into the normal flow so it can be caught.
// 3. Centralized Error Handling
// Instead of chaining .catch() to every single API request,
// try-catch lets you group multiple async steps into one block and handle all failures in one clean place.

// question 5

//Type conversion: explicit
// You intentionally convert the value using functions such as Number(), String(), or Boolean().
//
// const input = "42";
// const number = Number(input);
// console.log(number);        // 42
// console.log(typeof number); // "number"
//
// Anther one:
//
// String(100);      // "100"
// Boolean(1);       // true
// Number("12.5");   // 12.5
// parseInt("20px"); // 20
//
// Type coercion: implicit
// JavaScript automatically converts a value while evaluating an operation.
//
// const result = "5" + 2;
// console.log(result);        // "52"
// console.log(typeof result); // "string"