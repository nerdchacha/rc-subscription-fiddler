const express = require('express');
const path = require('path')

const app = express()

const PORT = process.env.SERVER_PORT || 3002

app.use(express.static('public'))

const nodeModulesDependencies = ['@ringcentral']
nodeModulesDependencies.forEach(dep => {
  app.use(`/${dep}`, express.static(path.resolve(`node_modules/${dep}`)));
});

app.get('/', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))