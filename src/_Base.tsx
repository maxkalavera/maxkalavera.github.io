import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Base = React.forwardRef<HTMLDivElement, Props>((
  {
    ...props
  }, 
  forwardedRef
) => {
  return (
    <div
      {...props}
      ref={forwardedRef}
    >
    </div>
  )
});

Base.displayName = 'Base';

export default Base