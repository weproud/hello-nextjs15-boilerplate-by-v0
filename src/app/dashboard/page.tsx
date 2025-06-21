import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드',
  description: '사용자 대시보드 페이지',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-2">
          사용자 활동과 통계를 확인할 수 있습니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">총 게시글</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">총 조회수</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">총 댓글</h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  )
} 