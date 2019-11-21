import fs from "fs";
import { ConfigInterface } from "./interface/configInterface";

const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;

for (const word in query.queries) {
    if (!fs.existsSync("output/"+query.queries[word]+".md")) {
        console.error(query.queries[word]+".md does not exist, research manually!!!")
    }
}
