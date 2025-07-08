import ChappyAiDiagnosis from './ChappyAiDiagnosis';
import ResultViewer from './ResultViewer';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChappyAiDiagnosis />} />
      <Route path="/result/:id" element={<ResultViewer />} />
    </Routes>
  );
}

export default App;
