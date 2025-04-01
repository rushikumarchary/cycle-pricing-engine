import TypingHeader from "./TypingHeader";
import { useState } from "react";

function Home() {
  const [showContent, setShowContent] = useState(false);

  // Listen for typing completion
  const handleTypingComplete = () => {
    setShowContent(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-[#28544B]">
      <div className="p-6">
        <TypingHeader onComplete={handleTypingComplete} />
      </div>

      <div className={`transition-all duration-1000 transform ${
        showContent 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}>
        <p className="text-lg mb-4 px-4 text-center font-semibold text-gray-900">
          Our Cycle Estimate Engine is designed to provide accurate and efficient pricing strategies 
          tailored to your business needs. By leveraging advanced algorithms, it helps you stay competitive 
          in the market while maximizing your profit margins.
        </p>
        
        <p className="text-lg font-semibold text-gray-900 mb-8 px-4 text-center">
          Whether you&apos;re managing brands or items, our engine offers seamless integration and real-time 
          updates to ensure your pricing is always optimized. Explore our features and take your business 
          to the next level.
        </p>
      </div>
    </div>
  );
}

export default Home;

