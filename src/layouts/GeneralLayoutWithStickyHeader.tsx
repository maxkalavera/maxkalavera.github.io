import { cn } from "@/lib/utils";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GeneralLayoutWithStickyHeader = React.forwardRef<HTMLDivElement, Props>((
  {
    children,
    ...props
  }, 
  forwardedRef
) => {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={cn(
        "w-full flex flex-col justify-start items-center gap-0",
      )}
    >
      <Header
        sticky={true}
        className="w-full h-header print:hidden z-10"
      />
      <main
        className={cn(
          "w-full min-h-content h-fit",
          "flex flex-col justify-stretch items-center",
        )}
      >
        {children}
      </main>
      <Footer
        className="w-full h-footer print:hidden z-10"
      />
    </div>
  )
});

GeneralLayoutWithStickyHeader.displayName = 'GeneralLayoutWithStickyHeader';

export default GeneralLayoutWithStickyHeader