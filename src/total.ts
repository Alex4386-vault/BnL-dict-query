import fs from "fs";
import { ConfigInterface } from "./interface/configInterface";

const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;

let totalString = "";

for (const word in query.queries.sort()) {
    totalString += fs.readFileSync("output/"+query.queries[word]+".md");
    totalString += "  \n  \n  \n  \n  \n";
}

fs.mkdirSync("total");
fs.writeFileSync("total/total.md", totalString);
