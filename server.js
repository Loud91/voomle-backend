const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';

const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Tous les champs sont requis' });

  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email déjà utilisé' });
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  writeUsers(users);
  res.json({ message: 'Utilisateur enregistré avec succès' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

  res.json({ id: user.id, name: user.name, email: user.email });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
