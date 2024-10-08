import React, { useState, useEffect } from 'react';

const MessageComponent = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) {
      // Hide the message after 4 seconds (4000 ms)
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);
      return () => clearTimeout(timer); // Cleanup the timeout
    }
  }, [showMessage]);

  const handleShowMessage = () => {
    setShowMessage(true);
  };

  return (
    <div>
      <button onClick={handleShowMessage}>Show Message</button>
      {showMessage && <div className="message">This is a temporary message!</div>}
    </div>
  );
};

export default MessageComponent;
