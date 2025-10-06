import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Turnos from './Pages/Turnos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turnos" element={<Turnos />} />
      </Routes>
    </Router>
  );
}

export default App;