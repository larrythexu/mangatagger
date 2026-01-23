import top500mangas from "@/data/top500manga.json";
import { type Manga } from "@/types";


export function getDailyManga() {

    const mangaList: Manga[] = top500mangas.data;
    // Seed based on current time zone
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const seed = year * 10000 + month * 100 + day;

    const randIndex = seed % mangaList.length;

    return mangaList[randIndex];
}
