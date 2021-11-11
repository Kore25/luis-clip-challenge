const moment = require('moment')
const { logger } = require('../libs/logger')
const { DatabaseError, UnknownError, InputError, RemoteError, EntityExistsError, EntityNotExistsError } = require('../libs/errors')
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
        const card = data.card
        delete data.card
        data.openpayId = await openpay.createCustomer(data).catch((err) => { throw new RemoteError(err) })
        data.cardData = await openpay.createCard(data.openpayId, card).catch((err) => { throw new RemoteError(err) })
        data.createdDate = moment().utc().toDate()
        data.updatedDate = moment().utc().toDate()
        await mongo.customers().insertOne(data).catch((err) => { throw new DatabaseError(err) })
        return res.json(true)
    } catch (err) {
        if (data.openpayId)
            await openpay.deleteCustomer(data.openpayId)
        return sendError(err)
    }
}

customersRes.put = async(req, res, sendError) => {
    logger.verbose('[customers,put]', 'Add new customer.')
    const id = req.params.id
    let data = req.body
    try {
        delete data.card
        const criteria = { _id: mongo.ObjectId(id) }
        const customer = await mongo.customers().findOne(criteria).catch((err) => { throw new DatabaseError(err) })
        if (!customer) throw new EntityNotExistsError()
        await validator.validate('customer', data).catch((err) => { throw new InputError(err) })
        await openpay.updateCustomer(customer.openpayId, data).catch((err) => { throw new RemoteError(err) })
        data.updatedDate = moment().utc().toDate()
        await mongo.customers().updateOne(criteria, { $set: data }).catch((err) => { throw new DatabaseError(err) })
        return res.json(true)
    } catch (err) {
        return sendError(err)
    }
}

customersRes.delete = async(req, res, sendError) => {
    logger.verbose('[customers,delete]', 'Add new customer.')
    const id = req.params.id
    try {
        const criteria = { _id: mongo.ObjectId(id) }
        const customer = await mongo.customers().findOne(criteria).catch((err) => { throw new DatabaseError(err) })
        if (!customer) throw new EntityNotExistsError()
        await openpay.deleteCustomer(customer.openpayId).catch((err) => { throw new RemoteError(err) })
        await mongo.customers().deleteOne(criteria).catch((err) => { throw new DatabaseError(err) })
        return res.json(true)
    } catch (err) {
        return sendError(err)
    }
}

customersRes.getAll = async(req, res, sendError) => {
    logger.verbose('[customers,getAll]', 'Get list customers.')
    const aggregate = [
        { $sort: { updatedDate: 1 } }
    ]
    logger.silly(aggregate)
    const customers = await mongo.customers().aggregate(aggregate).toArray().catch((err) => sendError(new DatabaseError(err)))
    return res.json(customers)
}

customersRes.get = async(req, res, sendError) => {
    logger.verbose('[customers,get]', 'Get customer by id.')
    const id = req.params.id
    try {
        const customer = await mongo.customers().findOne({ _id: mongo.ObjectId(id) }).catch((err) => { throw new DatabaseError(err) })
        if (!customer) throw new EntityNotExistsError()
        return res.json(customer)
    } catch (err) {
        return sendError(err)
    }
}

customersRes.charge = async(req, res, sendError) => {
    logger.verbose('[customers,charge]', 'Create a charge to customer.')
    const id = req.params.id
    try {
        const criteria = { _id: mongo.ObjectId(id) }
        const customer = await mongo.customers().findOne(criteria).catch((err) => { throw new DatabaseError(err) })
        if (!customer) throw new EntityNotExistsError()
        const charge = {
            source_id: customer.cardData.id,
            method: 'card',
            amount: 100,
            currency: 'MXN',
            description: 'Charge to ' + customer.name,
            order_id: mongo.ObjectId().toString(),
            device_session_id: 'kR1MiQhz2otdIuUlQkbEyitIqVMiI16f',
            customer: {
                name: customer.name,
                last_name: customer.last_name,
                phone_number: customer.phone_number,
                email: customer.email
            }
        }
        console.log('Data --->', charge)
        const chargeRes = await openpay.createCharge(charge).catch((err) => { throw new RemoteError(err) })
        await mongo.customers().updateOne(criteria, { $push: { charges: chargeRes } }).catch((err) => { throw new DatabaseError(err) })
        return res.json(true)
    } catch (err) {
        return sendError(err)
    }

}