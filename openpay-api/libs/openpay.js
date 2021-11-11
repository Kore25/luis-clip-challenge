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
    open = new Openpay(ID, PRIVATE_KEY, config.isProduction)
        // open.setSandboxMode(true);
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

openpayRes.updateCustomer = (id, customer) => {
    return new Promise((resolve, reject) => {
        logger.verbose('(openpay,updateCustomer)', 'Update customer.')
        open.customers.update(id, customer, function(err, body) {
            if (err)
                return reject(err)
            logger.verbose('(openpay,updateCustomer)', 'Customer saved.')
            return resolve(true)
        })
    })
}

openpayRes.deleteCustomer = (id) => {
    return new Promise((resolve, reject) => {
        logger.verbose('(openpay,deleteCustomer)', 'Delete customer.')
        open.customers.delete(id, function(err, body) {
            if (err)
                return reject(err)
            logger.verbose('(openpay,deleteCustomer)', 'Customer saved.')
            return resolve(true)
        })
    })
}

openpayRes.createCard = (customerId, card) => {
    return new Promise((resolve, reject) => {
        logger.verbose('(openpay,createCart)', 'Create a new card to customer.')
        console.log(customerId)
        console.log(card);
        open.customers.cards.create(customerId, card, function(err, body) {
            if (err)
                return reject(err)
            logger.verbose('(openpay,createCart)', 'Card saved.')
            return resolve(body)
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