"use client"
import React, { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import ThemesButton from "./ThemesButton";
import { EqualIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MobilesNavigationMenu = React.forwardRef<HTMLButtonElement, Props>((
  {
    ...props
  },
  forwardRef
) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => setIsOpen(value)}
    >
      <SheetTrigger
        asChild={true}
        ref={forwardRef}
      >
        <Button 
          variant='ghost'
          className={cn(
            props.className || '',
          )}        
        >
          <EqualIcon 
            className="text-2xl" 
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-describedby='Side menu for mobile devices'
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
          <div
            className={cn(
              'flex flex-row justify-start items-center gap-2'
            )}
          >
            <ThemesButton 
              className={navigationMenuTriggerStyle({})}
            />
          </div>
          <Separator 
            className='my-4'
          />
        </SheetHeader>
        
        <div
          className={cn(
            'flex flex-col justify-start items-start gap-0'
          )}
        >

          <Link href="/" legacyBehavior passHref>
            <Button 
              variant='ghost'
              onClick={() => setIsOpen(false)}
            >
              Home
            </Button>
          </Link>
          <Link href="/resume" legacyBehavior passHref>
            <Button 
              variant='ghost'
              onClick={() => setIsOpen(false)}
            >
              Resume
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
})

MobilesNavigationMenu.displayName = 'MobilesNavigationMenu';

export default MobilesNavigationMenu