import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        <div className="space-y-4">
          {/* 404 아이콘/숫자 */}
          <div className="flex justify-center">
            <div className="text-8xl font-bold text-muted-foreground/30">
              404
            </div>
          </div>

          {/* 404 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/">
              {t("goHome")}
            </Link>
          </Button>
        </div>

        {/* 장식적 요소 */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
} 