const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = 3000;

