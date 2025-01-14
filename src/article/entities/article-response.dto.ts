export class ArticleResponse {
  article: {
    title: string
    slug: string
    description: string
    body: string
    tagList?: Array<string>
    createdAt: Date
    updatedAt: Date
    favorited: false
    favoritesCount: number
    author: {
      username: string
      bio: string | null
      image: string | null
      following: boolean
    }
  }
}
