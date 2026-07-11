/** Post 인터페이스 */
export interface Post {
  id: string;
  title: string;
  content: string;
  nickname: string;
  category: string;
  purpose?: string | null;
  createdAt: Date;
  likeCount: number;
  likeByUsers: string[];
}

/** Comment 인터페이스 */
export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}
