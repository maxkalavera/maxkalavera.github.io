import Resume from "@/components/Resume";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div 
      className={cn(
        "p-4 w-full min-h-content",
        "flex flex-col justify-center items-center gap-8",
      )}
    >
      <Resume />
    </div>
  );
}
