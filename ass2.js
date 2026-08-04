const path = require("node:path");
const fs = require("node:fs");
const EventEmitter = require("node:events");
const os = require("node:os");
const zlib = require("node:zlib");
const {pipeline} = require("node:stream");
const http = require("node:http");

// Q1: Print the current file path and directory
function question1() {
    console.log(`File: ${__filename}, Dir: ${__dirname}`);
}

question1();


// Q2: Get the filename from a path
function question2() {
    const inputPath = "/user/files/report.pdf";
    const fileName = path.basename(inputPath);

    console.log(fileName);
}

question2();


// Q3: Create a path from an object
function question3() {
    const fileObject = {
        dir: "/folder",
        name: "app",
        ext: ".js"
    };

    const formattedPath = path.format(fileObject);

    console.log(formattedPath);
}

question3();


// Q4: Get the file extension
function question4() {
    const inputPath = "/docs/readme.md";
    const extension = path.extname(inputPath);

    console.log(extension);
}

question4();


// Q5: Parse a path
function question5() {
    const inputPath = "/home/app/main.js";
    const parsedPath = path.parse(inputPath);

    console.log({
        name: parsedPath.name,
        ext: parsedPath.ext
    });
}

question5();


// Q6: Check whether a path is absolute
function question6() {
    const inputPath = "/home/user/file.txt";
    const result = path.isAbsolute(inputPath);

    console.log(result);
}

question6();


// Q7: Join multiple path segments
function question7() {
    const joinedPath = path.join(
        "src",
        "components",
        "App.js"
    );

    console.log(joinedPath);
}

question7();


// Q8: Resolve a relative path
function question8() {
    const resolvedPath = path.resolve("./ass2.js");

    console.log(resolvedPath);
}

question8();


// Q9: Join two paths
function question9() {
    const firstPath = "/folder1";
    const secondPath = "folder2/file.txt";

    const joinedPath = path.join(firstPath, secondPath);

    console.log(joinedPath);
}

question9();


// Q10: Delete a file asynchronously
function question10() {
    const filePath = "./file.txt";

    fs.unlink(filePath, (error) => {
        if (error) {
            console.log(
                "Failed to delete the file:",
                error.message
            );
            return;
        }

        console.log(`${filePath} was deleted successfully.`);
    });
}

question10();


// Q11: Create a folder
function question11() {
    const folderPath = "uploads/profiles";

    try {
        fs.mkdirSync(folderPath, {recursive: true});
        console.log("Folder created successfully.");
    } catch (error) {
        console.log(
            "Error creating folder:",
            error.message
        );
    }
}

question11();


// Q12: Create and trigger a start event
function question12() {
    const startEmitter = new EventEmitter();

    startEmitter.on("start", () => {
        console.log("Welcome event triggered!");
    });

    startEmitter.emit("start");
}

question12();


// Q13: Create a login event with a username
function question13() {
    const userEmitter = new EventEmitter();

    userEmitter.on("login", (userName) => {
        console.log(`User logged in: ${userName}`);
    });

    userEmitter.emit("login", "toka");
}

question13();


// Q14: Read a file synchronously
function question14() {
    try {
        const result = fs.readFileSync(
            "./notes.js",
            "utf8"
        );

        console.log(`The file content => ${result}`);
    } catch (error) {
        console.log(
            "Error reading file:",
            error.message
        );
    }
}

question14();


// Q15: Write to a file asynchronously
function question15() {
    fs.writeFile(
        "./async.txt",
        "Async save",
        (error) => {
            if (error) {
                console.log(
                    "This operation failed:",
                    error.message
                );
                return;
            }

            console.log("File saved successfully.");
        }
    );
}

question15();


// Q16: Check whether a file exists
function question16() {
    const fileExists = fs.existsSync("./async.txt");

    console.log(fileExists);
}

question16();


// Q17: Display operating system information
function question17() {
    console.log(
        `Platform: ${os.platform()}, Arch: ${os.arch()}`
    );
}

question17();


// Q18: Read a large file using a stream
function question18() {
    const readableStream = fs.createReadStream(
        "./Big.txt",
        {
            encoding: "utf8"
        }
    );

    readableStream.on("data", (chunk) => {
        console.log(chunk);
    });

    readableStream.on("error", (error) => {
        console.log(
            "Failed to read the file:",
            error.message
        );
    });
}

question18();


// Q19: Copy a file using streams
function question19() {
    const readStream = fs.createReadStream("./Big.txt");
    const writeStream = fs.createWriteStream("./async.txt");

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
        console.log("File copied using streams.");
    });

    readStream.on("error", (error) => {
        console.log(
            "Error reading source file:",
            error.message
        );
    });

    writeStream.on("error", (error) => {
        console.log(
            "Error writing destination file:",
            error.message
        );
    });
}

question19();


// Q20: Compress a file using gzip and pipeline
function question20() {
    const sourceFile = "./Big.txt";
    const destinationFile = "./Big.txt.gz";

    const readStream = fs.createReadStream(sourceFile);
    const gzipStream = zlib.createGzip();
    const writeStream = fs.createWriteStream(destinationFile);

    pipeline(
        readStream,
        gzipStream,
        writeStream,
        (error) => {
            if (error) {
                console.log(
                    "Pipeline failed:",
                    error.message
                );
                return;
            }

            console.log("File successfully compressed!");
        }
    );
}

question20();

function questionHttp() {
    // defining some hekpers to be re-used later in each condition
    const usersFilePath = path.resolve("./users.json");
    const readUsers = function () {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data) || [];
    }
    const addUser = function (name,email, age) {
        const userObj = {
            name: name, email: email, age: age
        };
        const users = readUsers();
        users.push(userObj);
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
        return users;
    }
    const findUserById = function (id) {
        const users = readUsers();
        return users[id];
    }
    const updateUser = function (id, age) {
        const users = readUsers();
        let targetUser = users[id];
        targetUser.age = age;
        users[id] = targetUser;
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
        return targetUser;
    }
    const findUserByEmail = function (email) {
        const users = readUsers();
        return users.filter(user => user.email === email);
    }
    const deleteUser = function (id) {
        let users = readUsers();
        delete users[id];
        console.log(users);
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
        return users;
    }

    const server = http.createServer((req, res) => {
        const url = req.url;
        const method = req.method;
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        })
        req.on("end", () => {
            // parsing string to JS Object to be able to use like normal JS Object
            try {
                body = JSON.parse(body);
            } catch (error) {
                body = {};
            }
            console.log(url,method)
            if (url === '/users' && method === 'GET') {
                res.write(JSON.stringify(readUsers()));
                res.end();
            }

            if (url === '/users' && method === 'POST') {
                if (findUserByEmail(body.email).length) {
                    res.write(JSON.stringify({
                        "message": "Email already exists!"
                    }));
                    res.end()
                } else {
                    addUser(body.name, body.email, body.age);
                    res.write(JSON.stringify({
                        message: "User added successfully."
                    }))
                    res.end();
                }
            }

            const regex = /^\/users\/(\d+)$/;
            if (regex.test(url) && method === 'GET') {
                const id = url.split('/')[2];
                const user = findUserById(id);
                if (user) {
                    res.write(JSON.stringify(user));
                } else {
                    res.write(JSON.stringify({"message":"User not found"}))
                }
                res.end();

            }

            if (regex.test(url) && method === 'PATCH') {
                // update age of id
                const id = url.split('/')[2];
                if (!findUserById(id)) {
                    res.write(JSON.stringify({
                        "message": "User not found"
                    }))
                    res.end();
                    return;
                }
                const age = body.age;
                updateUser(id, age);
                res.write(JSON.stringify({
                    "message":"Age updated"
                }))
                res.end()
            }

            if (regex.test(url) && method === 'DELETE') {
                const id = url.split('/')[2];
                deleteUser(id)
                res.write(JSON.stringify({
                    "message": "User deleted successfully."
                }))
                res.end();
            }

        })

    })
    server.listen(3000, (err) => {
        if (err) {
            console.log("Error listening on port 3000");
        } else {
            console.log("Listening on port 3000");
        }

    });
}
questionHttp();
