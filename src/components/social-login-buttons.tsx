"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";

// 소셜 로그인 버튼 스타일 정의
const socialButtonStyles = {
  google: {
    bg: "bg-white hover:bg-gray-100",
    text: "text-white",
    border: "border border-gray-300",
    icon: (
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  kakao: {
    bg: "bg-[#FEE500] hover:bg-[#FDD835]",
    text: "text-[#191919]",
    border: "",
    icon: (
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2.5C6.47761 2.5 2 6.08248 2 10.5C2 13.0757 3.49332 15.3369 5.78248 16.7103C5.59864 17.3065 5.0539 19.1755 4.92179 19.6309C4.76166 20.1981 5.12948 20.1981 5.36332 20.0461C5.54717 19.9297 7.88362 18.3519 8.88219 17.6903C9.87358 17.8775 10.9174 17.9775 12 17.9775C17.5224 17.9775 22 14.3951 22 9.97752C22 5.56 17.5224 2.5 12 2.5Z"
        />
      </svg>
    ),
  },
};

export function SocialLoginButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    google: false,
    kakao: false,
  });

  const handleSocialLogin = async (provider: string) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));

    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error("Failed to sign in");
      } else if (result?.url) {
        toast.success("Sign in successfully");
        router.push(result.url);
      }
    } catch (error) {
      toast.error(`Failed to sign in: ${error}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        type="button"
        variant="outline"
        className={`${socialButtonStyles.google.bg} ${socialButtonStyles.google.text} ${socialButtonStyles.google.border} w-full`}
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading.google}
      >
        {isLoading.google ? (
          <span className="mr-2 animate-spin">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : (
          socialButtonStyles.google.icon
        )}
        Continue with Google
      </Button>
    </div>
  );
}
