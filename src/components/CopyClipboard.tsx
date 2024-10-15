"use client"
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {
  content: String;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CopyClipboard = React.forwardRef<HTMLButtonElement, Props>((
  {
    content,
    ...props
  }, 
  forwardedRef
) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = useCallback(() => {
    navigator
      .clipboard
      .writeText(content)
      .then(() => {
        setIsOpen(true);
      });
  },[content]);

  useEffect(() => {
    let callback: NodeJS.Timeout;
    if (isOpen) {
      callback = setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    }
    return () => {
      callback && clearTimeout(callback);
    };
  }, [isOpen]);

  return (
    <TooltipProvider>
      <Tooltip
        open={isOpen}
      >
        <TooltipTrigger
          asChild
        >
          <Button
            {...props}
            ref={forwardedRef}
            onClick={onClick}
            className="p-2 w-fit h-fit"
            variant="ghost"
            size="icon"
          >
            <CopyIcon 
              className="w-4 h-4"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent asChild>
          <span 
            className="font-serif text-sm"
          >
            Copied to clipboard
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
});

CopyClipboard.displayName = 'CopyClipboard';

export default CopyClipboard;