import Image from "next/image";
import { getDailyManga } from "@/lib/mangaService";

export default function Home() {

  const dailyManga = getDailyManga();
  console.log(dailyManga);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {dailyManga.node.title}
      <Image src={dailyManga.node.main_picture.medium} alt={dailyManga.node.title} width={500} height={500} />
    </div>
  );
}
