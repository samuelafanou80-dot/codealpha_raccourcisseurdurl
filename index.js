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