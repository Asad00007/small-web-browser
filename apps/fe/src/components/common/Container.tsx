import React from "react";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`max-w-7xl w-full px-5 mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
