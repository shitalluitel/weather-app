const yargs = require('yargs')
const request = require('request')
const chalk = require('chalk')
const setting = require('./config/settings')

const log = console.log


const input = yargs.options(
    {
        'place': {
            demandOption: true,
            type: 'string'
        }
    }
).argv

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
        (error, response, body) => {
            if (error) {
                log(chalk.red('Unable to connect with mab box api.'))
            } else if (body.error) {
                log(chalk.red('Unable to fetch geo data records.'))
            } else {
                callback(body.features[0].center.reverse().join())
            }
        }
    )
}

getGeoCode(
    input.place,
    (latLong) => {
        request(
            setting.weatherstack.url,
            {
                method: 'GET',
                json: true,
                qs: {
                    access_key: setting.weatherstack.api,
                    query: latLong
                }
            },
            (error, response) => {
                    if (error) {
                        log(chalk.red('Unable to fetch weather data due to some error.'))
                    } else {
                        debugger
                        try {
                            const data = response.body.current
                            log(`It is currently ${data.temperature} degrees out. There is a ${data.precip}% change of rain.`)
                        } catch (error) {
                            log(chalk.yellow('Unable to fetch weather data.'))
                        }
                    }
                }
            )
    }
)