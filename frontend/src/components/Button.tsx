import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string; 
  className?: string; // Optional for custom styles
}

const Button: React.FC<ButtonProps> = ({ label, onClick, href, className }) => {
  const baseStyles =
    "px-6 py-3 rounded-lg shadow text-center font-semibold transition-colors";
  const combinedStyles = `${baseStyles} ${className || ""}`;

  if (href) {
    return (
      <a
        href={href}
        className={`${combinedStyles}`}
      >
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedStyles}>
      {label}
    </button>
  );
};

export default Button;
