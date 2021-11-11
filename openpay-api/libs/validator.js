const Ajv = require('ajv')
const path = require('path')
const fs = require('fs')

const SCHEMAS_DIR = path.join(__dirname, '..', 'schemas')

const ajv = new Ajv({
    verbose: true,
    schemaId: 'auto',
    allErrors: true
});

(() => {
    fs.readdir(SCHEMAS_DIR, function(err, files) {
        if (err)
            throw new Error('validator error: cannot read schemas directory')
        files.forEach(function(fileName) {
            if (!fileName.match(new RegExp(/([a-zA-Z0-9\s_\\.])+json/, 'ig')))
                return
            let json = require(path.join(SCHEMAS_DIR, fileName))
            ajv.addSchema(json)
        })
    })
})()

exports.validate = function(schema, jsonData) {
    let filePath = path.join(SCHEMAS_DIR, schema + '.json')
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath))
            return reject(new Error('validator error: schema does not exists'))
        let validate = ajv.getSchema('/' + schema)
        let valid = validate(jsonData)
        if (!valid)
            return reject(ajv.errorsText(validate.errors))
        resolve(valid)
    })
}