import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '메시지',
  description: '메시지 관리 페이지',
}

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">메시지</h1>
        <p className="text-muted-foreground mt-2">
          받은 메시지와 보낸 메시지를 관리할 수 있습니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">메시지 목록</h3>
            <div className="space-y-2">
              <div className="p-3 hover:bg-muted rounded-lg cursor-pointer">
                <p className="text-sm text-muted-foreground">메시지가 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">메시지 내용</h3>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              메시지를 선택하세요.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 