import React from 'react';

const Alert = ({ children, ...props }) => <div {...props}>{children}</div>;
const AlertDescription = ({ children, ...props }) => <p {...props}>{children}</p>;

export { Alert, AlertDescription };
