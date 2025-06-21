import LocaleSwitcherSelect from '@/components/locale-switcher-select'
import ThemeToggle from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '설정',
  description: '애플리케이션 설정을 관리할 수 있습니다.',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground mt-2">
          애플리케이션 설정을 관리하고 개인화할 수 있습니다.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* 모양 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>모양</CardTitle>
            <CardDescription>
              애플리케이션의 테마와 언어를 설정할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">테마</div>
                <div className="text-sm text-muted-foreground">
                  라이트 모드와 다크 모드 중 선택하세요.
                </div>
              </div>
              <ThemeToggle />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">언어</div>
                <div className="text-sm text-muted-foreground">
                  인터페이스 언어를 선택하세요.
                </div>
              </div>
              <LocaleSwitcherSelect 
                defaultValue="ko"
                items={[
                  { value: "ko", label: "한국어" },
                  { value: "en", label: "English" }
                ]}
                label="언어 선택"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* 계정 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>계정</CardTitle>
            <CardDescription>
              계정 정보와 보안 설정을 관리할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              계정 설정 기능은 준비 중입니다.
            </div>
          </CardContent>
        </Card>
        
        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>알림</CardTitle>
            <CardDescription>
              알림 수신 방식을 설정할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              알림 설정 기능은 준비 중입니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 