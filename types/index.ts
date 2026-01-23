interface Picture {
    medium: string;
    large: string;
}

interface Genre {
    id: number;
    name: string;
}

interface AlternativeTitles {
    synonyms: string[];
    en: string;
    ja: string;
}

export interface Manga {
    node: {
        id: number;
        title: string;
        main_picture: Picture;
        genres: Genre[];
        alternative_titles: AlternativeTitles;
    }
    ranking: {
        rank: number;
    };
}