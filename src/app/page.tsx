import { cn } from "@/lib/utils";
import Hero from "./_components/Hero";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import GeneralLayout from "@/layouts/GeneralLayout";

export default function Home() {
  return (
    <GeneralLayout>
      <div 
        className={cn(
          "p-4 w-full min-h-content",
          "flex flex-col justify-center items-center gap-8",
        )}
      >
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] opacity-50",
          )}
        />
        <Hero />
      </div>
    </GeneralLayout>

  );
}
