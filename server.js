import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const DATA_FILE = './results.json';

function loadResults() {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE));
  }
  return {};
}

function saveResults(results) {
  writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
}

app.post('/results', (req, res) => {
  const results = loadResults();
  const id = uuidv4();
  results[id] = req.body;
  saveResults(results);
  res.json({ id });
});

app.get('/results/:id', (req, res) => {
  const results = loadResults();
  const data = results[req.params.id];
  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }
  return res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
