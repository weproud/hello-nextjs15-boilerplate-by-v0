import { PostForm } from '@/components/post/post-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '게시글 작성',
  description: '새로운 게시글을 작성할 수 있습니다.',
}

export default function NewPostPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">게시글 작성</h1>
        <p className="text-muted-foreground mt-2">
          새로운 게시글을 작성하고 공유해보세요.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <PostForm />
      </div>
    </div>
  )
} 