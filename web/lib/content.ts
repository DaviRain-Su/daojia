import chaptersData from "@/content/chapters.json";
import manualChaptersData from "@/content/manual-chapters.json";

export type Chapter = {
  id: string;
  title: string;
  content: string;
  sourcePageStart: number | null;
  sourcePageEnd: number | null;
};

const chapters = [...(manualChaptersData as Chapter[]), ...(chaptersData as Chapter[])];

export function getAllChapters(): Chapter[] {
  return chapters;
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function getChapterNeighbors(id: string): {
  prev: Chapter | null;
  next: Chapter | null;
} {
  const index = chapters.findIndex((chapter) => chapter.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}
