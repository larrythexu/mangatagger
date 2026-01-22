interface Picture {
    medium: string;
    large: string;
}

interface Genre {
    id: number;
    name: string;
}

interface Ranking {
    rank: number;
}

interface Manga {
    id: number;
    title: string;
    main_picture: Picture;
    genres: Genre[];
    ranking: Ranking;
}