const { logger } = require('../libs/logger')
const { name } = require('../package.json')
const applicationRes = exports
applicationRes.init = () => { return applicationRes }

applicationRes.status = async function(req, res) {
    logger.verbose("[application,status]", "service status")
    res.json({
        uptime: parseInt(process.uptime()),
        name: name,
        env: process.env.NODE_ENV
    })
}