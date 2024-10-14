//import Resume from "@/components/Resume";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
          <Button
            variant="default"
            size="sm"
            className="text-primary-foreground flex flex-row justify-center items-center gap-2"
            asChild
          >
            <a
              href="/static/resume.pdf"
              download="Max Hernandez - Resume.pdf"
            >
            Download PDF
              <DownloadIcon className="w-4 h-4 text-primary-foreground" />
            </a>

          </Button>
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
