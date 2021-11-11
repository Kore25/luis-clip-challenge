const Openpay = require('openpay')
const config = require('config').openpay
const { logger } = require('./logger')

const openpayRes = module.exports
const ID = config.id
const PRIVATE_KEY = config.privateKey
let open;

(_ => {
    if (ID == null || ID == "<set-id>" || PRIVATE_KEY == null || PRIVATE_KEY == "<set-private-key>")
        throw new Error("check openpay settings in config")
    logger.debug(ID, PRIVATE_KEY, config.isProduction)
    open = new Openpay(ID, PRIVATE_KEY, config.isProduction)
})()

openpayRes.createCustomer = (customer) => {
    return new Promise((resolve, reject) => {
        logger.verbose('(openpay,createCustomer)', 'Create customer.')
        open.customers.create(customer, function(err, body) {
            if (err)
                return reject(err)
            logger.verbose('(openpay,createCustomer)', 'Customer saved.')
            logger.debug(body.id)
            return resolve(body.id)
        })
    })
}

openpayRes.createCharge = (charge) => {
    return new Promise((resolve, reject) => {
        logger.verbose('(openpay,createCharge)', 'Create charge.')
        open.charges.create(charge, function(err, body) {
            if (err) {
                logger.error('(openpay,createCharge)', 'Error: ', err.toString())
                return reject(err)
            }
            logger.verbose('(openpay,createCharge)', 'Charge saved.')
            logger.debug(body)
            return resolve(true)
        })
    })
}