import React from "react";

interface TitleProps {
  title: string;
  subtitle: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8 md:mb-16 z-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-zinc-800 dark:text-zinc-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-zinc-500 dark:text-zinc-400 sm:text-sm text-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Title;
