import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MobilesNavigationMenu from "@/components/MobilesNavigationMenu";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {
  sticky?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Header = React.forwardRef<HTMLDivElement, Props>((
  {
    sticky,
    ...props
  }, 
  forwardedRef
) => {
  return (
    <header
      {...props}
      ref={forwardedRef}
      className={cn(
        "header",
        "w-full",
        "flex flex-row justify-center items-stretch gap-2",
        !!sticky && "sticky top-0 backdrop-blur",
        props.className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-screen-lg p-4",
          "flex flex-row justify-between items-center gap-4",
        )}
      >
        <Link href="/" legacyBehavior passHref>
          <Button 
            variant="ghost"
            className={navigationMenuTriggerStyle()}
          >
            <h2
              className={cn(
                "font-display text-xl md:text-3xl text-foreground",
              )}
            >
              Max Hernandez
            </h2>
          </Button>
        </ Link>

        <Navbar 
          className='hidden md:block' 
        />
        <MobilesNavigationMenu 
          className='md:hidden'
        />
      </div>
    </header>
  )
})

Header.displayName = 'Header';

export default Header