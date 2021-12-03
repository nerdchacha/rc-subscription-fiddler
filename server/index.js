const express = require('express');
const path = require('path')

const app = express()

const PORT = process.env.SERVER_PORT || 3002

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const nodeModulesDependencies = ['@ringcentral']
nodeModulesDependencies.forEach(dep => {
  app.use(`/${dep}`, express.static(path.resolve(`node_modules/${dep}`)));
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))