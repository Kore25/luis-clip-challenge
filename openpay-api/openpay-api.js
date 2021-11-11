#!/bin/env node

require('dotenv').config()

const config = require('config')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const { logger } = require('./libs/logger')
const mongo = require('./libs/mongo')

const APPLICATION_PORT = config.application.port

const app = express()
const router = express.Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(morgan(':date[iso]\x1b[34m verbose \x1b[39m <<< :method :url :status - :response-time ms'))

app.set('port', APPLICATION_PORT)

router.use(function(req, res, next) {
    logger.verbose('>>>', req.method, req._parsedUrl.pathname)
    logger.debug('>>', req.query, req.body)
    next()
});

const _errorHandler = (err, req, res, next) => {
    logger.error('_errorHandler =>', err.toString())
    res.status(err.status || 500)
    if (process.env.NODE_ENV == 'dev') logger.debug('<<', err.response)
    if (err.response) res.json(err.response)
    else {
        logger.error(err.stack)
        res.end()
    }
}

(async() => {
    const db = await mongo.getClient()
    const application = require('./resources/application').init()
    const auth = require('./resources/auth').init(db)
    const customers = require('./resources/customers').init(db)

    router.get('/', application.status)

    router.post('/customers', auth.configApiKey, customers.add)
    router.get('/customers', auth.configApiKey, customers.get)
    router.put('/customers/:id', auth.configApiKey, customers.put)

    app.use('/', router)
    app.use(_errorHandler)

    app.listen(app.get('port'), () => {
        logger.info(`listening on port: ${APPLICATION_PORT} ...`)
    })
})()
.catch((e) => {
    if ("stack" in e) logger.error(e.stack)
    logger.error(e)
})