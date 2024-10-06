import { cn } from "@/lib/utils";
import React from "react";
import DisplayIlustration from "./DisplayIlustration";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Hero = React.forwardRef<HTMLDivElement, Props>((
  {
    ...props
  }, 
  forwardedRef
) => {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={cn(
        "w-full sm:max-h-content-slide",
        "flex flex-col justify-center items-center gap-0 md:flex-row",
      )}
    >
      <div
        data-testid='introductory-paragraph'
        className={cn(
          "w-full h-fit max-w-screen-sm z-10",
          "flex flex-col justify-center items-end gap-2",
        )}
      >
        <h1 className="font-sans text-foreground text-5xl md:text-6xl text-center md:text-end">
          Hi, I am Max Hernandez
        </h1>
        <h4 className="font-serif text-amber-600  dark:text-primary-300 text-lg md:text-2xl text-center md:text-end">
          Crafting code with innovation and boundless creativity!
        </h4>
      </div>
      <div
        className="max-w-full z-0"
      >
        <DisplayIlustration />
      </div>

    </div>
  )
})

Hero.displayName = 'Hero';

export default Hero
