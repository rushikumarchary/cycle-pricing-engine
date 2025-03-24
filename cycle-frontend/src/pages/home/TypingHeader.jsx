import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TypingHeader = ({ onComplete }) => {
  
  const mainText = `Welcome to the Cycle Pricing Engine`;
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < mainText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + mainText[index]);
        setIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      // Typing is complete
      onComplete?.();
    }
  }, [index, mainText, onComplete]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold mb-2">{displayedText}</h1>
    </div>
  );
};

TypingHeader.propTypes = {
  onComplete: PropTypes.func
};

export default TypingHeader;
