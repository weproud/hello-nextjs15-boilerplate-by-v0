import { PostList } from '@/components/post/post-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '게시글 목록',
  description: '모든 게시글을 확인할 수 있습니다.',
}

export default function PostsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">게시글 목록</h1>
          <p className="text-muted-foreground mt-2">
            모든 게시글을 확인하고 관리할 수 있습니다.
          </p>
        </div>
        
        <Button asChild>
          <Link href="/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            새 게시글
          </Link>
        </Button>
      </div>
      
      <PostList />
    </div>
  )
} 