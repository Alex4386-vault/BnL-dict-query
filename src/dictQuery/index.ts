import request from "request";
import { userAgentString, stripHtmlTags } from "../common";
import { JSDOM } from "jsdom";

interface Word {
    word: string;
    definitions: Array<string[]>
}

export function dictionaryQuery(word){

    const option = {
        url: "https://www.merriam-webster.com/dictionary/"+encodeURIComponent(word),
        headers: {
            "User-Agent": userAgentString
        }
    }
    request(option, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            const { document } = new JSDOM(body).window;
            const defWrap = document.getElementById("definition-wrapper");
            const wordHeaders = defWrap.getElementsByClassName("anchor-name");
            const lengthWords = wordHeaders.length;

            console.log(lengthWords);

            for (let i = 0; i < lengthWords; i++) {
                const current = defWrap.getElementsByClassName("entry-header")[i];
                const theWord = stripHtmlTags(current.getElementsByClassName("hword")[0].innerHTML);
                let gerund = stripHtmlTags(current.getElementsByClassName("fl")[0].innerHTML);
                try {
                    gerund += stripHtmlTags(current.getElementsByClassName("lbs")[0].innerHTML);
                } catch(e) {}

                console.log(theWord, gerund);

                const dictEntries = Array.from(defWrap.getElementsByClassName("vg")[0].getElementsByClassName("sb"));
                const definitions = [];
                for (let dictEntry of dictEntries) {
                    let entryDefinitions = [];
                    for (let meaningEntry of Array.from(dictEntry.getElementsByClassName("sense"))) {
                        for (let examples of Array.from(meaningEntry.getElementsByClassName("ex-sent"))) {
                            examples.remove();
                        }
                        let o = stripHtmlTags(meaningEntry.getElementsByClassName("dtText")[0].innerHTML).replace(/(\t|\n)/g,"").trim()
                        if (/^( )+$/.test(o)) { continue; }
                        o = o.replace(/^: /, "");
                        entryDefinitions.push(o);
                    }
                    definitions.push(entryDefinitions);
                }


                const word: Word = {
                    word: theWord,
                    definitions
                };

                console.log(word);
            }
        }
    });


}