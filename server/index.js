const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const PORT = process.env.PORT || 3002

app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

const nodeModulesDependencies = ['@ringcentral']
nodeModulesDependencies.forEach((dep) => {
	app.use(`/${dep}`, express.static(path.resolve(`node_modules/${dep}`)))
})

app.use('/hooks/webhook', (req, res) => {
	const validationToken = req.headers['validation-token']
	console.log(validationToken)
	if (validationToken) { return res.header('validation-token', validationToken).status(200).send() }
	console.log(req.body)
	res.status(200).send()
})

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
