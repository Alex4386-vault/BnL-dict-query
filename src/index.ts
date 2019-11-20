import request from "request";
import fs from "fs";

const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;

if (query.sortMe) {
    query.queries.sort();
    console.log("Sorted!");
}

console.log(query.queries);

query.queries.forEach( (currentWord) => {

})
