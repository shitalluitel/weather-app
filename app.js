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


request(
    setting.mapBox.url + input.place + '.json',
    {
        method: 'GET',
        json: true,
        qs: {
            access_token: setting.mapBox.api,
            limit: 1,
        }
    },
    (error, response) => {
        if (error) {
            log(chalk.yellowBright('Unable to find location.'))
        } else {
            const data = response.body.features[0]
            const latLong = data.center.reverse().join()

            log(latLong)
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
    }
)

