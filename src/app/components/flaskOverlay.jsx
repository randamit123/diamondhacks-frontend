import React from 'react';

const FlaskAppIframe = () => {
  return (
    <iframe
      className="card margin-auto display-block w-full h-full align-start justify-center"
      
      src="http://localhost:8080/video"
      title="Flask App"
    />
  );
};

export default FlaskAppIframe;
