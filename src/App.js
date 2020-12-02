import logo from './logo2.svg';
import Particles from './Particles'
import './App.css';

function App() {
  return (
    <div className="App flex-container">

      <div className="hero flex-box">
        <img alt="Home Automation Systems" src="/Show_Villa_3D_Type_Pool.JPG"></img>
      </div>
      <div className="content flex-box">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Distrupting Home Automation Solutions</p>
            <p>E: enquire@zling.com</p>
        </header>
        <Particles></Particles>
      </div>
    </div>
  );
}

export default App;
