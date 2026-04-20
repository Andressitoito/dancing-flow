const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', '..', 'db');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

const dbPath = (filename) => path.join(DB_DIR, filename);

const readDB = (file) => {
  try {
    if (!fs.existsSync(dbPath(file))) return [];
    return JSON.parse(fs.readFileSync(dbPath(file), 'utf8'));
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
    return [];
  }
};

const writeDB = (file, data) => {
  try {
    fs.writeFileSync(dbPath(file), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`Error writing ${file}:`, e);
    throw e;
  }
};

const getUserById = (id) => {
  const users = readDB('users.json');
  return users.find(u => u.id === id);
};

module.exports = { readDB, writeDB, getUserById };
