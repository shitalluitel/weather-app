const request = require('request')
const chalk = require('chalk')
const setting = require('../config/settings')

// this is some how similar to python decorators
const getGeoCode = (location, callback) => {
    request(
        setting.mapBox.url + location + '.json',
        {
            method: 'GET',
            json: true,
            qs: {
                access_token: setting.mapBox.api,
                limit: 1
            }
        },
        (error, { body }) => {
            if (error) {
                callback(chalk.red('Unable to connect with mab box api.'), undefined)
            } else if (body.error) {
                callback(chalk.red('Unable to fetch geo data records.'), undefined)
            } else {
                callback(null, body.features[0].center.reverse().join())
            }
        }
    )
}

module.exports = getGeoCode