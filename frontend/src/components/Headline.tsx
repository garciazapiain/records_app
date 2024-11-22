import React from "react";

interface HeadlineProps {
  title: string;
  subtitle?: string; // Optional subtitle
}

const Headline: React.FC<HeadlineProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-white">{subtitle}</p>}
    </header>
  );
};

export default Headline;
