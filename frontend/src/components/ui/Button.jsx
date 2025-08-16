import React from 'react';

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? 'div' : 'button';
  return <Comp className={`button ${variant} ${size} ${className}`} {...props} />;
};

export default Button;