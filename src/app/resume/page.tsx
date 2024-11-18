import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DownloadIcon } from "lucide-react";
import ResumeTemplate from "@/components/ResumeTemplate";
import resume from '@/../content/resume/resume.json';
import profilePicture from "@/assets/images/profile.png";
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
              <Button
                variant="outline"
                size="sm"
                className="text-foreground flex flex-row justify-center items-center gap-2 dark:border-secondary-500"
              >
                Download
                <DownloadIcon className="w-4 h-4 text-foreground" />
              </Button>
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
          meta={{ 
            profilePicture 
          }}
        />
      </div>
    </GeneralLayout>
  );
}
