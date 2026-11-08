import React from "react";

const Container = ({
  children,
  className,
  maxW,
}: {
  children: React.ReactNode;
  className?: string;
  maxW?: string;
}) => {
  return (
    <div
      className={`${maxW ? maxW : "max-w-7xl"} w-full px-5 mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
