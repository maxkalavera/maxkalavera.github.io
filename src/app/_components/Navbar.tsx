import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import ThemesButton from "./ThemesButton";
import { Separator } from "@/components/ui/separator"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Navbar = React.forwardRef<HTMLDivElement, Props>((
  {
    ...props
  }, 
  forwardedRef
) => {
  return (
    <NavigationMenu
      {...props}
      ref={forwardedRef}
      className={cn(
        (props.className || ''),
      )}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "font-serif text-md"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/resume" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "font-serif text-md"
              )}
            >
              Resume
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "font-serif text-md"
              )}
            >
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/*
        <NavigationMenuItem>
          <Link href="/projects" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "font-serif text-md"
              )}
            >
              Projects
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        */}

        <Separator orientation="vertical" />

        <NavigationMenuItem asChild>
          <ThemesButton 
            className={cn(
              navigationMenuTriggerStyle({}),
              "p-1"
            )}
          />  
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
})

Navbar.displayName = 'Navbar';

export default Navbar