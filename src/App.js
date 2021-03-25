import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import Header from "./components/header";
import Chart from "./components/chart";

function App() {
  return (
    <div className="App">
      <Header />
      <Navbar />
      <Chart />
    </div>
  );
}

export default App;
