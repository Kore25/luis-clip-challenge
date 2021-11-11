const moment = require('moment')
const { logger } = require('../libs/logger')
const { DatabaseError, UnknownError, InputError, RemoteError, EntityExistsError } = require('../libs/errors')
const validator = require('../libs/validator')
const openpay = require('../libs/openpay')

const customersRes = module.exports
let mongo

customersRes.init = (_mongo) => {
    mongo = _mongo
    return customersRes
}

customersRes.add = async(req, res, sendError) => {
    logger.verbose('[customers,add]', 'Add new customer.')
    let data = req.body
    try {
        await validator.validate('customer', data).catch((err) => { throw new InputError(err) })
        const customer = await mongo.customers().countDocuments({ email: data.email, phone_number: data.phone_number }).catch((err) => { throw new DatabaseError(err) })
        if (customer > 0) throw new EntityExistsError()
        data.openpay = await openpay.createCustomer(data).catch((err) => { throw new RemoteError(err) })
        data.createdDate = moment().utc().toDate()
        data.updatedDate = moment().utc().toDate()
        await mongo.customers().insertOne(data).catch((err) => { throw new DatabaseError(err) })
        return res.json(true)
    } catch (err) {
        return sendError(err)
    }
}

customersRes.put = async(req, res, sendError) => {

}

customersRes.get = async(req, res, sendError) => {
    logger.verbose('[customers,add]', 'Get list customers.')
    const aggregate = [
        { $sort: { updatedDate: 1 } }
    ]
    logger.silly(aggregate)
    const customers = await mongo.customers().aggregate(aggregate).toArray().catch((err) => sendError(new DatabaseError(err)))
    return res.json(customers)
}