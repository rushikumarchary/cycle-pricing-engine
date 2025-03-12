import { Link } from "react-router-dom";

function About() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">📜 About Page</h1>
      <Link to="/" className="px-4 py-2 bg-green-500 text-white rounded">Go to Home</Link>
    </div>
  );
}

export default About;
