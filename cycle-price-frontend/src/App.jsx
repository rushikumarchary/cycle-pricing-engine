import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 // Ensure correct path and casing
import Layout from "./component/Layout/Layout";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import CalculateForm from "./pages/calculateForm/CalculateForm";
import Estimates from "./pages/estimates/Estimates";
import SignIn from "./pages/sign_in/SingIn";
import SignUp from "./pages/sign_out/SignUp";
import { EstimateProvider } from "./context/EstimateContext"
import Items from "./pages/items/Items";
import Brand from "./pages/brand/Brand";


function App() {
  return (
    <EstimateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/calculateForm" element={<CalculateForm />} />
            <Route path="/estimates" element={<Estimates />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/items" element={<Items />} />
            <Route path="/brand" element={<Brand />} />
          </Route>
        </Routes>
      </Router>
    </EstimateProvider>
  );
}

export default App;
