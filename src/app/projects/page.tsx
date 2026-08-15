import React from "react";
import { cn } from "@/lib/utils";
import GeneralLayout from "@/layouts/GeneralLayout";
import Markdown from "@/components/Markdown";
import Image from "next/image";


export const getContentData = (): {
  projects: {
    title: {
      content: string;
      link: string;
    };
    description: string;
    image: string;
    timestamp: string;
  }[]
} => {
  return {
    projects: [
      {
        title: {
          content: 'Ecommerce Demo NestJS/NextJS',
          link: "https://github.com/maxkalavera/ecommerce"
        },
        description: `
          A basic template or set-up of a generic e-commerce web app, 
          it provides helper tools to run a development environment using docker and basic settings for a NestJS backend and a basic NextJS server.
          <br/><br/>
          Repository URL: <br/>
          [https://github.com/maxkalavera/ecommerce](https://github.com/maxkalavera/ecommerce)
        `,
        image: 'https://raw.githubusercontent.com/maxkalavera/ecommerce/refs/heads/main/docs/assets/screenshot.png',
        timestamp: "2026-08-10T16:34:10.240Z"
      },
      {
        title: {
          content: 'Amberpad (Notes App)',
          link: "https://amberpad.github.io/"
        },
        description: `
          Amberpad right now is a demo in alpha version of a note-taking app.<br />
          It is open-source, cross-platform note-taking app built with Node.js, Electron, React, and TypeScript.<br />
          Amberpad is designed to be simple, usable, secure, and accessible—everything a note-taking app should be.
          <br/><br/>
          Website URL: <br/>
          [https://amberpad.github.io/](https://amberpad.github.io/)
        `,
        image: "https://github.com/amberpad/amberpad-desktop/raw/main/docs/amberpad-screenshot-dark.png",
        timestamp: "2026-08-10T16:57:39.385Z"
      },
      {
        title: {
          content: 'React Component Isolator',
          link: 'https://github.com/maxkalavera/react-component-isolator'
        },
        description: `
          React library build with the objective of having a place to visualize React components graphically isolated builded to work in any environment able to run React.
          <br/><br/>
          Repository URL: <br/>
          [https://github.com/maxkalavera/react-component-isolator](https://github.com/maxkalavera/react-component-isolator)
        `,
        image: 'https://raw.githubusercontent.com/maxkalavera/react-component-isolator/refs/heads/main/README/screenshot.png',
        timestamp: "2026-08-10T17:35:38.546Z"
      },
    ]
  };
}

export default function ResumePage() {
  const content = getContentData();

  return (
    <GeneralLayout>
      <section 
        className={cn(
          "p-4 md:p-8 w-full min-h-content max-w-screen-lg",
          "flex flex-col justify-start items-start gap-8",
        )}
      >
        <h1
          className={cn(
            "text-4xl text-foreground font-sans"
          )}
        >
          Projects
        </h1>

        
        <div
          className={cn(
            "w-full h-fit",
            "flex flex-col justify-start items-start gap-6"
          )}
        >
          {content.projects.map(({
            title,
            description,
            image
          }, index) => (
            <div
              key={index}
              className={cn(
                "w-full h-fit px-8 py-10",
                // "flex flex-row justify-start items-stretch gap-6",
                "flex flex-col justify-start items-center gap-6",
                "md:flex-row md:justify-start md:items-stretch md:gap-6",
                "outline outline-[1px] outline-white/50 rounded-md"
              )}
            >
              {/* Content */}
              <div
                className={cn(
                  "w-full h-fit",
                  "flex flex-col justify-start items-start gap-4"
                )}
              >
                <a
                  href={title.link}
                >
                  <h3 
                    className="text-xl text-foreground font-bold underline"
                  >
                    {title.content}
                  </h3>
                </a>
                <Markdown 
                  className="w-full"
                >
                  {description.toString().trim()}
                </Markdown>
              </div>              
              {/* Image */}
              <div
                className={cn(
                  "w-full h-full",
                  "flex flex-col justify-center items-end",
                  "rounded-sm overflow-hidden",
                  "border-yellow-500/20 border-[1px]"
                )}
              >
                <Image
                  className="w-auto h-auto select-none pointer-events-none"
                  src={image}
                  width={400}
                  height={300}
                  alt="Project's Image"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </GeneralLayout>
  );
}

