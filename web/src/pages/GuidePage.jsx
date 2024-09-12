import React from 'react';

function GuidePage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F2FFE9', // Set this to the image's background color
      }}
    >
      <img
        src={process.env.PUBLIC_URL + "/img/forest_of_animals2.png"}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
        alt="Forest of Animals"
      />
    </div>
  );
}

export default GuidePage;
