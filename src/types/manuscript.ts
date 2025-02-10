
export interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

export interface ChapterCreate {
  chapter_id: string;
  content: string;
  book_id: string;
  sort_order: number;
}
