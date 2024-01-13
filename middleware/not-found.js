const path = require('path');

const notFound = (req, res) => {
  console.log('not found');
  res.status(404).sendFile(path.join(__dirname, '..', 'public', 'not-found.html'));
};

module.exports = notFound;