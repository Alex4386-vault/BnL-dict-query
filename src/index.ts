import fs from "fs";
import { dictionaryQuery } from "./dictQuery";
//import { ConfigInterface } from "./interface/configInterface";

//const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;
/*
if (query.sortMe) {
    query.queries.sort();
    console.log("Sorted!");
}

console.log(query.queries);
*/
dictionaryQuery("face");
// dictionaryQuery(query.queries[0]);

/*
query.queries.forEach( (currentWord) => {

})
*/
