import React from 'react';

const MetroStationIcon = ({ name, onClick, style }) => {
  return (
    <div
      onClick={() => onClick(name)}
      className="absolute w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
      title={name}
      style={style}
    >
      <div className="w-4 h-4 bg-white rounded-full"></div>
    </div>
  );
};

export default MetroStationIcon;
