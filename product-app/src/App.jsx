import "bootstrap/dist/css/bootstrap.min.css";
import { Routes,Route } from "react-router-dom";

import ProductList from "./components/ProductList";

function App() {
  return (
    <>
    <Routes>
     <Route path="/" element= {<ProductList />}/>
      </Routes>
    </>
  );
}
export default App;
