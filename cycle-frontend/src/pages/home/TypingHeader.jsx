import { useState, useEffect } from 'react';

const TypingHeader = () => {
  const text = 'Welcome to the Cycle Estimate Engine';
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <h1 className="text-4xl font-extrabold mb-6">{displayedText}</h1>;
};

export default TypingHeader;
