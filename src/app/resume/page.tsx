import React from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DownloadIcon } from "lucide-react";
import ResumeTemplate from "@/components/ResumeTemplate";
import resume from '@/../content/resume/resume.json';
import GeneralLayout from "@/layouts/GeneralLayout";

export default function ResumePage() {
  return (
    <GeneralLayout>
      <div 
        className={cn(
          "p-4 w-full min-h-content max-w-screen-lg",
          "flex flex-col justify-start items-center gap-8",
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row justify-center sm:justify-end items-center px-4 z-50",
            "fixed bottom-4",
            "sm:sticky sm:top-4",
            "print:hidden",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DownloadButton
                className={cn(
                  "flex flex-row justify-center items-center gap-2 flex-nowrap",
                )}
              >
                Download
                <DownloadIcon className="w-4 h-4" />
              </DownloadButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className=""
            >
              <DropdownMenuLabel>
                <a
                  className="flex flex-row justify-start items-center gap-2"
                  href="/static/resume/resume.pdf"
                  download="Max Hernandez - Resume.pdf"
                >
                  Download Resume PDF
                  <DownloadIcon className="w-4 h-4 text-foreground" />
                </a>
              </DropdownMenuLabel>
              <DropdownMenuLabel>
                <a
                  className="flex flex-row justify-start items-center gap-2"
                  href="/static/resume/cover.pdf"
                  download="Max Hernandez - Cover Letter.pdf"
                >
                  Download Cover Letter PDF
                  <DownloadIcon className="w-4 h-4 text-foreground" />
                </a>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ResumeTemplate 
          resume={resume}
        />
      </div>
    </GeneralLayout>
  );
}


/******************************************************************************
 * Secondary components
 */


const DownloadButton = React.forwardRef<
  HTMLButtonElement, 
  React.ComponentPropsWithoutRef<React.ElementType>
>((
  {
    children,
    className="",
    ...props
  }, 
  forwardedRef
) => {
  return (
    <button
      {...props}
      ref={forwardedRef}
      className={cn(
        "p-[3px] relative",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-500 rounded-lg",
        )}
      />
      <div 
        className={cn(
          "px-8 py-2",
          "bg-background rounded-[6px] relative group transition duration-200 text-foreground hover:text-white hover:bg-transparent",
          className
        )}
      >
        {children}
      </div>
  </button>
  )
});
DownloadButton.displayName = 'DownloadButton';
