import fs from "fs";
import { dictionaryQuery } from "./dictQuery/merriamWebster";
import { ConfigInterface } from "./interface/configInterface";
import util from "util";
import { searchDictionary, dictionaryQueryViaWordId } from "./dictQuery/naver";

const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;

if (query.sortMe) {
    query.queries.sort();
    console.log("Sorted!");
}

console.log(query.queries);

/*
let i = 0;

for (let i = 0; i < query.queries.length; i++) {
  setTimeout( async () => {
    const word = await dictionaryQuery(query.queries[i]);
    console.log(util.inspect(word, false, null, true));
  }, 1000*i);

}
*/

searchDictionary("face").then(
  (wordId) => {
    dictionaryQueryViaWordId(wordId).then(
      (wa) => {
        for (const waa in wa) {
          console.log(util.inspect(wa, false, null, true));
        }
      }
    )
  }
)
