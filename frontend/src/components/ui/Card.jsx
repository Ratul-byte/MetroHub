const Card = ({ className, ...props }) => (
  <div className={`card ${className}`} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={`card-content ${className}`} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={`card-header ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h2 className={`card-title ${className}`} {...props} />
);

export { Card, CardContent, CardHeader, CardTitle };