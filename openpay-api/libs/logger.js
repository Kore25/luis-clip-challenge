const config = require('config').get('logger')
const { createLogger, format, transports, addColors } = require('winston')
const { combine, timestamp, colorize, printf, padLevels } = format
const { SPLAT } = require('triple-beam')
const { isObject } = require('lodash')

const all = format((info) => {
    const splat = info[SPLAT] || []
    const message = formatObject(info.message)
    const rest = splat.map(formatObject).join(' ')
    info.message = `${message} ${rest}`
    return info
})

function formatObject(param) {
    if (isObject(param)) return JSON.stringify(param)
    return param
}

addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'blue',
    debug: 'cyan',
    silly: 'magenta'
})

const logger = createLogger({
    level: 'silly',
    levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
    format: combine(
        all(),
        timestamp(),
        colorize(),
        padLevels(),
        printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level} ${formatObject(message)}`
        })
    ),
    silent: false
})

if (config.console) {
    if (config.console.level == null)
        throw new Error("check logger config for console transport")
    logger.add(new transports.Console({
        level: config.console.level,
        silent: config.console.silent || false,
        handleExceptions: true
    }))
}

if (config.files) {
    if (config.files.length < 1)
        throw new Error("check logger config for files transport")

    config.files.forEach(function(file) {
        if (file.level == null)
            throw new Error("check logger config for files transport")
        logger.add(
            new transports.File({
                level: file.level,
                silent: file.silent || false,
                filename: (file.path ||  "./logs/") + (file.name || file.level + ".log"),
                maxsize: file.maxsize || 1000000,
                maxFiles: file.maxFiles || 1
            })
        )
    })
}

module.exports.logger = logger