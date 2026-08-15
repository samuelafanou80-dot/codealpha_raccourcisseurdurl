const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./urls.db', (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err);
  } else {
    console.log('Connecté à la base de données SQLite.');
    // Création de la table 'urls' si elle n'existe pas encore
    db.run(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL
      )
    `);
  }
});

app.post('/api/shorten', (req, res) => {
  let { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Veuillez fournir une URL valide.' });
  }

  // NETTOYAGE : Supprime les espaces inutiles au début et à la fin
  originalUrl = originalUrl.trim();

  // AJOUT SÉCURITÉ : Rajoute "https://" si l'utilisateur l'a oublié
  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    originalUrl = 'https://' + originalUrl;
  }

  const shortCode = nanoid(6);

  // Construction dynamique du domaine (ex: http://localhost:3000 ou https://ton-domaine.com)
  const hostUrl = `${req.protocol}://${req.get('host')}`;

  const query = `INSERT INTO urls (short_code, original_url) VALUES (?, ?)`;
  db.run(query, [shortCode, originalUrl], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde.' });
    }

    res.json({
      shortCode: shortCode,
      shortUrl: `${hostUrl}/${shortCode}` // <--- URL courte générée dynamiquement
    });
  });
});