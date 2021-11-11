const { logger } = require('../libs/logger')
const { DatabaseError, UnknownError } = require('../libs/errors')
const validator = require('../libs/validator')

const customersRes = module.exports
let mongo

customersRes.init = (_mongo) => {
    mongo = _mongo
    return customersRes
}

customersRes.add = async(req, res, sendError) => {

}

customersRes.put = async(req, res, sendError) => {

}

customersRes.get = async(req, res, sendError) => {

}