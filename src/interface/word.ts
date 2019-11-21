
export interface Word {
    gerund: string;
    word: string;
    definitions: Definition[];
}

export interface Definition {
    pronunciation: string;
    syllables: string;
    main: string;
    sub: string[];
}