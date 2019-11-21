import request from "request";
import { userAgentString, stripHtmlTags } from "../common";
import { JSDOM } from "jsdom";
import { Word, Definition } from "../interface/word";

// Debug only
import util from "util";

type WordId = string;

export function searchDictionary(word): Promise<WordId> {
    return new Promise(
        (resolve, reject) => {
            const option = {
                url: "https://dict.naver.com/search.nhn?dicQuery="+encodeURIComponent(word)+"query="+encodeURIComponent(word)+"&target=dic&ie=utf8",
                headers: {
                    "User-Agent": userAgentString
                }
            }
            request(option, (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    const { document } = new JSDOM(body).window;

                    const wa = document.getElementsByClassName("c_b");
                    if (wa.length !== 0) {
                        for (let i = 0; i < wa.length; i++) {
                            if (stripHtmlTags(wa[i].innerHTML).trim().toLowerCase() === word.toLowerCase()) {
                                const wordId = (wa[i].parentNode as HTMLAnchorElement).href.replace("http://endic.naver.com/enkrEntry.nhn?entryId=", "");
                                resolve(wordId);
                            }
                        }
                        reject(null);
                    } else {
                        reject(null);
                    }
                }
            });
        }
    )
}

export function dictionaryQueryViaWordId(wordId,): Promise<Word[]> {
  return new Promise<Word[]> (
    (resolve, reject) => {
        const wordArray: Word[] = [];
        const option = {
            url: "http://endic.naver.com/enkrEntry.nhn?sLn=kr&entryId="+encodeURIComponent(wordId),
            headers: {
                "User-Agent": userAgentString
            }
        }
        console.log(option.url);
        request(option, async (err, response, body) => {
            if (!err && response.statusCode === 200) {

                const { document } = new JSDOM(body).window;

                const topWordView = document.getElementById("content");
                let pronunciation = "";
            
                const toptopWordView = topWordView.getElementsByClassName("tit")[0];
                const wordWrapper = toptopWordView.getElementsByTagName("h3");
                const wordName = stripHtmlTags(wordWrapper[0].innerHTML);
                pronunciation = stripHtmlTags(topWordView.getElementsByClassName("fnt_e16")[0].innerHTML).replace(/\[/g,"").replace(/\]/g,"");
                
                const wordInfoView = document.getElementById("zoom_content");
                const definitionView = wordInfoView.getElementsByClassName("_means_content");
                

                for (let i = 0; i < definitionView.length; i++) {
                    const currentWord = definitionView[i];
                    const gerund = stripHtmlTags(currentWord.getElementsByClassName("dic_tit6")[0].innerHTML);

                    const definitions: Definition[] = [];
                    
                    const currentWordMeanings = currentWord.getElementsByClassName("list_a3")[0].getElementsByClassName("meanClass");
                    for (let i = 0; i < currentWordMeanings.length; i++) {
                        const rawDefinition = currentWordMeanings[i].getElementsByClassName("align_line")[0];

                        try {
                            rawDefinition.getElementsByTagName("a")[0].remove();
                        } catch(e) {

                        }
                        const definition = stripHtmlTags(rawDefinition.innerHTML).replace(/(\t|\n)/g, "").replace(/\s{2,}/g, " ").trim();
                        const placeHolderDefinition: string[] = [];

                        definitions.push({
                            main: definition,
                            sub: placeHolderDefinition,
                            pronunciation,
                            syllables: ""
                        })
                    }  

                    

                    const word: Word = {
                        word: wordName,
                        definitions,
                        gerund
                    }

                    wordArray.push(word);
                }
                

                

                resolve(wordArray);
                

                //resolve(word);
            }
      });
    }
  )




}
