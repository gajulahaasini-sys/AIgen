import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '', as: Component = 'span' }) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      {/* @ts-ignore - dynamic component typing issue with data attributes */}
      <Component className="glitch-text" data-text={text}>
        {text}
      </Component>
    </div>
  );
};
