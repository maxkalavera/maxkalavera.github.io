import { cn } from "@/lib/utils";
import React from "react";
import ReactMarkdown from "react-markdown";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<typeof ReactMarkdown>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Markdown = React.forwardRef<HTMLDivElement, Props>((
  {
    ...props
  },
) => {
  return (
    <ReactMarkdown 
      {...props}
      className={cn(
        props.className,
        "text-md font-serif"
      )}
      components={{
        a: (props) => (
          <a
          className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
            {...props}            
          />
        ),
        blockquote: (props) => (
          <blockquote
            {...props}            
          />
        ),
        br: (props) => (
          <br
            {...props}            
          />
        ), 
        code: (props) => (
          <code
            {...props}            
          />
        ), 
        em: (props) => (
          <em
            {...props}            
          />
        ), 
        h1: (props) => (
          <h1
            {...props}            
          />
        ), 
        h2: (props) => (
          <h2
            {...props}            
          />
        ), 
        h3: (props) => (
          <h3
            {...props}            
          />
        ), 
        h4: (props) => (
          <h4
            {...props}            
          />
        ), 
        h5: (props) => (
          <h5
            {...props}            
          />
        ), 
        h6: (props) => (
          <h6
            {...props}            
          />
        ), 
        hr: (props) => (
          <hr
            {...props}            
          />
        ), 
        img: (props) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...props}
            alt={(props.alt || "") as unknown as string}
          />
        ), 
        li: (props) => (
          <li
            {...props}            
          />
        ), 
        ol: (props) => (
          <ol
            {...props}            
          />
        ), 
        p: (props) => (
          <p
            {...props}            
          />
        ), 
        pre: (props) => (
          <pre
            {...props}            
          />
        ), 
        strong: (props) => (
          <strong
            {...props}            
          />
        ),
        ul: (props) => (
          <ul
            {...props}            
          />
        ),
      }}
    />
  )
});

Markdown.displayName = 'Markdown';

export default Markdown;

/******************************************************************************
 *  Secondary components
 *****************************************************************************/
