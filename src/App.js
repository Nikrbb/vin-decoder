import './App.scss';
import Nav from "./components/Navigation/Nav";
import NavRoutes from "./components/NavRoutes/NavRoutes";


function App() {
  return (
    <div className="App">
      <div className="container">
          <Nav/>
          <NavRoutes/>
      </div>
    </div>
  );
}

export default App;
