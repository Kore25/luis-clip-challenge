const config = require('config').get('auth')
const { AuthError } = require('../libs/errors')
const { logger } = require('../libs/logger')

const APIKEY = config.apiKey
const authRes = module.exports

authRes.init = () => {
    return authRes
}

/**
 * Verifies that the apikey is valid, checks apikey from config
 **/
authRes.configApiKey = function(req, res, next) {
    logger.debug("[auth,configApiKey]", "validating master apiKey")
    let apiKey = req.headers.apiKey || req.headers.apikey || null
    if (apiKey == null || apiKey !== APIKEY) throw new AuthError()
    next()
}