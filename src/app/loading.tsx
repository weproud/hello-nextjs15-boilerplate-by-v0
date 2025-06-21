import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("LoadingPage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        <div className="space-y-4">
          {/* 로딩 스피너 */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          </div>

          {/* 로딩 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>

        {/* 로딩 바 (선택적) */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 