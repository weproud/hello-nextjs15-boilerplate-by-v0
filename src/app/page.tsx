import ThemeToggle from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Label className="text-4xl font-black">
          Hello Nextjs 15 Boilerplate by v0
        </Label>
        <ThemeToggle />
      </main>
    </div>
  );
}
