"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4 text-center space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-destructive"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  앱에서 오류가 발생했습니다
                </h2>
                <p className="text-muted-foreground">
                  예상치 못한 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="default"
                size="default"
                className="w-full sm:w-auto"
              >
                다시 시도
              </Button>
              <Button
                onClick={this.handleRefresh}
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
              >
                페이지 새로고침
              </Button>
              <Button
                asChild
                variant="ghost"
                size="default"
                className="w-full sm:w-auto"
              >
                <Link href="/">
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  오류 상세보기 (개발 모드)
                </summary>
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <pre className="text-xs text-destructive overflow-auto">
                    {this.state.error.message}
                  </pre>
                  {this.state.error.stack && (
                    <pre className="text-xs text-muted-foreground overflow-auto max-h-40 mt-2">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
