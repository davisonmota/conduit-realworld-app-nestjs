export class CommentResponse {
  comment: {
    id: string
    body: string
    createdAt: Date
    updatedAt: Date
    author: {
      username: string
      bio: string | null
      image: string | null
      following: boolean
    }
  }
}
