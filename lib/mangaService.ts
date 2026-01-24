import top500mangas from "@/data/top500manga.json";
import { type Manga } from "@/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_YEAR = 366;

// Returns day index based on date. Assumes 366 length array, extra day for leap years
function dateToDateIdx(date: Date) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 1);
    const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const dayIdx = Math.floor((today - start) / MS_PER_DAY);

    return dayIdx;
}

// Gets daily manga based on date
// MangaList is updated & shuffled by scripts/fetch_manga.py YEARLY
export function getDailyManga() {
    // Get day index
    const today = new Date();
    const dayIndex = dateToDateIdx(today);

    // Get slice of array - 366 days (last day only used if leap year)
    const mangaList: Manga[] = top500mangas.data;
    const slicedMangaList = mangaList.slice(0, DAYS_PER_YEAR);

    // Add offset slicing for more randomness??
    // const offset = (seed * DAYS_PER_YEAR) % mangaList.length;
    // const firstHalf = mangaList.slice(offset)
    // const secondHalf = mangaList.slice(0, DAYS_PER_YEAR - firstHalf.length)
    // const shuffledMangaList = [...firstHalf, ...secondHalf];

    return slicedMangaList[dayIndex];
}
