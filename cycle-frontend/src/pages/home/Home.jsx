import { Link } from "react-router-dom";
import { hasManagementAccess } from "../../utils/auth"; // Adjust the path as necessary
import TypingHeader from "./TypingHeader";


function Home() {
 


  return (
    <div className="flex flex-col items-center justify-center h-screen text-[#28544B] ">
      {/* <h1 className="text-4xl font-extrabold mb-6">Welcome to the Cycle Estimate Engine</h1> */}
      <div className="p-6">
      <TypingHeader />
    </div>
     
      
      <p className="text-lg mb-4 px-4 text-center">
        Our Cycle Estimate Engine is designed to provide accurate and efficient pricing strategies 
        tailored to your business needs. By leveraging advanced algorithms, it helps you stay competitive 
        in the market while maximizing your profit margins.
      </p>
      
      <p className="text-lg mb-8 px-4 text-center">
        Whether you&apos;re managing brands or items, our engine offers seamless integration and real-time 
        updates to ensure your pricing is always optimized. Explore our features and take your business 
        to the next level.
      </p>
      
      {hasManagementAccess() ? (
        <div className="flex gap-5 items-center justify-center">
          <Link to="/brand" className="px-6 py-3 bg-green-900 hover:bg-green-700 text-white rounded shadow-lg transition duration-300">
            Manage Brands
          </Link>
          <Link to="/items" className="px-6 py-3 bg-green-700 hover:bg-green-500 text-white rounded shadow-lg transition duration-300">
            Manage Items
          </Link>
        </div>
      ) : (<></> )}
    </div>
  );
}

export default Home;

