"use client"
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useTheme } from 'next-themes'
import { LoaderIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ThemesButton = React.forwardRef<HTMLDivElement, Props>((
  {
    ...props
  }, 
  forwardedRef
) => {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // To use the button only after the first render
    // This to allow the server and render have the same 
    // content in the first render
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger
            disabled={true}
            className="text-lg"
          >
            <LoaderIcon 
              className="w-4 h-4 text-foreground animate-spin"
            />
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )
  }

  return (
    <Menubar
      {...props}
      ref={forwardedRef}
    >
      <MenubarMenu>
        <MenubarTrigger
          className="text-lg"
        >
          {((() => {
            if (theme === 'light') {
              return (
                <SunIcon className="w-4 h-4 text-foreground" />
              )
            } else if (theme === 'dark') {
              return (
                <MoonIcon className="w-4 h-4 text-foreground" />
              )
            } else {
              return (
                <SunMoonIcon className="w-4 h-4 text-foreground" />
              )
            }
          })())}
        </MenubarTrigger>

        <MenubarContent>
          <MenubarItem onClick={() => setTheme('system')}>
            System
          </MenubarItem>
          <MenubarItem onClick={() => setTheme('light')}>
            Light
          </MenubarItem>
          <MenubarItem onClick={() => setTheme('dark')}>
            Dark
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
})

ThemesButton.displayName = 'ThemesButton';

export default ThemesButton