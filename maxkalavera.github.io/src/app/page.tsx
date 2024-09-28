import { cn } from "@/lib/utils";
import Image from "next/image";
import Hero from "./_components/Hero";
import Meteors from "@/components/ui/meteors";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";

export default function Home() {
  return (
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
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] opacity-50",
        )}
      />
      <Hero />
    </div>
  );
}
