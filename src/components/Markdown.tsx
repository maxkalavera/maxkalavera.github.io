import { cn } from "@/lib/utils";
import React, { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { cb as syntaxHighlighterStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import 'katex/dist/katex.min.css'
import CopyClipboard from "./CopyClipboard";

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
        "text-md font-serif prose prose-gray dark:prose-invert prose-sm md:prose-base",
        props.className,
      )}
      remarkPlugins={[
        remarkGfm,
        remarkMath,
      ]}
      rehypePlugins={[
        rehypeKatex,
      ]}
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
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              {...rest as unknown as SyntaxHighlighterProps}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={syntaxHighlighterStyle}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
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
        pre: ({
          children,
          ...props
        }) => (
          <pre
            {...props}
            className="relative"
          >
            <div
              className="flex flex-row justify-end absolute z-10 right-0 top-0 not-prose"
            >
              <CopyClipboard
                content={(children as ReactElement)?.props?.children}
              />
            </div>
            {children}
          </pre>
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
