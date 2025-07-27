/* Assignment Question:

> Using only Node.js built-in modules (http, fs, and url), write a server that manages a price list of goods. The server should allow users to view all goods, add new goods, update existing goods, and delete goods from the list.

Each good must include the following properties:

* id (auto generated with uuid),
* name (string),
* inStock (boolean),
* unit (string, e.g., "1 crate", "1 liter"),
* unitPrice (number),
* totalPrice (number), which should be calculated automatically by the server and not provided by the user.


Store all goods in a local goods.json file and ensure all responses are in JSON format. Do not use Express — only core http Node.js modules.


How to submit: Create a repo on git hub and share repo link.

Deadline: 11:59pm Sunday 27, July */

const http = require("http");
const fs = require("fs");
const url = require("url");
const uuid = require("uuid").v4;

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    if (path === "/goods" && method === "GET") {
        const goods = JSON.parse(fs.readFile("goods.json"));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(goods));
    } else if (path === "/create-goods" && method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const newGood = JSON.parse(body);
            newGood.id = uuid();
            const goods = JSON.parse(fs.readFile("goods.json"));
            goods.push(newGood);
            fs.writeFile("./goods.json", JSON.stringify(goods));
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newGood));
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log("Server started on port 3000");
});
