import fs from "fs";
import { dictionaryQuery } from "./dictQuery";
import { ConfigInterface } from "./interface/configInterface";
import util from "util";

const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;

if (query.sortMe) {
    query.queries.sort();
    console.log("Sorted!");
}

console.log(query.queries);

let i = 0;

for (let i = 0; i < query.queries.length; i++) {
  setTimeout( async () => {
    const word = await dictionaryQuery(query.queries[i]);
    console.log(util.inspect(word, false, null, true));
  }, 1000*i);

}
