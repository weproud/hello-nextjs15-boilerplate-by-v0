"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("테스트 에러: Error Boundary가 이 에러를 캐치해야 합니다!");
  }

  return (
    <div className="p-4 border rounded-lg bg-muted/30">
      <h3 className="text-lg font-semibold mb-4">Error Boundary 테스트</h3>
      <p className="text-sm text-muted-foreground mb-4">
        아래 버튼을 클릭하면 의도적으로 에러를 발생시켜 Error Boundary를 테스트할 수 있습니다.
      </p>
      <Button
        onClick={() => setShouldThrow(true)}
        variant="destructive"
        size="sm"
      >
        에러 발생시키기
      </Button>
    </div>
  );
} 