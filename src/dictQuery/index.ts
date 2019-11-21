import request from "request";
import { userAgentString, stripHtmlTags } from "../common";
import { JSDOM } from "jsdom";

// Debug only
import util from "util";

interface Word {
    word: string;
    definitions: Definition[];
}

interface Definition {
    main: string;
    sub: string[];
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
            const pronounciation = stripHtmlTags(defWrap.getElementsByClassName("prs").innerHTML);
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
                    let entryMainDefinition = undefined;
                    let entrySubDefinitions = [];
                    for (let meaningEntry of Array.from(dictEntry.getElementsByClassName("sense"))) {
                        for (let examples of Array.from(meaningEntry.getElementsByClassName("ex-sent"))) {
                            examples.remove();
                        }

                        let o = stripHtmlTags(meaningEntry.getElementsByClassName("dtText")[0].innerHTML).replace(/(\t|\n)/g,"").trim()
                        if (meaningEntry.getElementsByClassName("sl").length != 0) {
                            o = stripHtmlTags(meaningEntry.getElementsByClassName("sl")[0].innerHTML) + o;
                        } else {
                            if (/^( )+$/.test(o)) { continue; }
                        }
                        o = o.replace(/^: /, "");
                        if (meaningEntry.classList.contains("has-num-only")) {
                            entryMainDefinition = o;
                        } else {
                            entrySubDefinitions.push(o);
                        }
                        
                    }
                    definitions.push({
                        main: entryMainDefinition,
                        sub: entrySubDefinitions
                    } as Definition);
                }


                const word: Word = {
                    word: theWord,
                    definitions
                };

                console.log(util.inspect(word, false, null, true));
            }
        }
    });


}