import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '검색',
  description: '게시글과 사용자를 검색할 수 있습니다.',
}

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">검색</h1>
        <p className="text-muted-foreground mt-2">
          게시글과 사용자를 검색할 수 있습니다.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="검색어를 입력하세요..."
              className="pl-10"
            />
          </div>
          <Button>검색</Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">검색 결과</h3>
            <div className="text-center py-12 text-muted-foreground">
              검색어를 입력하여 검색을 시작하세요.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 