import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecordList from "./pages/RecordList";
import CreateRecord from "./pages/CreateRecord";
import RecordDetail from "./pages/RecordDetail";
import EditRecord from "./pages/EditRecord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<RecordList />} />
        <Route path="/records/new" element={<CreateRecord />} />
        <Route path="/records/detail/:id" element={<RecordDetail />} />
        <Route path="/records/:id/edit" element={<EditRecord />} />
      </Routes>
    </Router>
  );
}

export default App;
