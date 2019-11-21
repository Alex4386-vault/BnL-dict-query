import fs from "fs";
import { dictionaryQuery } from "./dictQuery/merriamWebster";
import { ConfigInterface } from "./interface/configInterface";
import util from "util";
import { searchDictionary, dictionaryQueryViaWordId } from "./dictQuery/naver";
import { Word } from "./interface/word";

const query = JSON.parse(fs.readFileSync("query/query.json").toString()) as ConfigInterface;

if (query.sortMe) {
    query.queries.sort();
    console.log("Sorted!");
}

console.log(query.queries);

let i = 0;

function writeWordToMarkdown(enWords:Word[], koWords: Word[]) {
  let meaningTmp = "";
  const enWord = enWords[0];
  const koWord = koWords[0];
  for (let i = 0; i < koWords.length; i++) {

    meaningTmp += `### ${i+1}. ${koWords[i].gerund}\n`;
    for (let j = 0; j < koWords[i].definitions.length; j++) {
      meaningTmp += `${j+1}. ${koWords[i].definitions[j].main}\n`
    }

  }

  fs.writeFileSync("output/"+enWord.word+".md",
`# ${enWord.word}

## Korean Meaning

${meaningTmp}

## Syllable

${koWord.word}

## Accent

\`\`\`
${enWord.word}

\`\`\`

## Pronunciation

### Korean Phonetic Interpretation

### Phonetic Alphabet
${enWord.definitions[0].pronunciation}

`)
}

let failList = [];

for (let i = 0; i < query.queries.length; i++) {
  setTimeout( async () => {

      const enWords = await dictionaryQuery(query.queries[i]).catch( () => { failList.push(query.queries[i]); } );
      console.log(util.inspect(enWords, false, null, true));

      const koDicWordId = await searchDictionary(query.queries[i]).catch( () => { failList.push(query.queries[i]); } );;
      const koDicWords = await dictionaryQueryViaWordId(koDicWordId).catch( () => { failList.push(query.queries[i]); } );;

      if (enWords && koDicWords) {
        writeWordToMarkdown(enWords, koDicWords);
      }
      

    lastCheck(i+1);


  }, 1000*i);

}

function lastCheck(i:number) {
  if (i === query.queries.length) {
    console.error("failList", failList);
  }
}


