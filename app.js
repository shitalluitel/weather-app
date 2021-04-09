const yargs = require('yargs')
const request = require('request')
const setting = require('./config/settings')
// const chalk = require('chalk')
const getGeoCode = require('./utils/geoGeoCode')
const forecast = require('./utils/forecast')

const log = console.log


const input = yargs.options(
    {
        'place': {
            demandOption: true,
            type: 'string'
        }
    }
).argv



getGeoCode(
    input.place,
    (error, data) => {
        if (error) {
            log(error)
        } else {
          forecast(data, (error, data) => {
              if (error) {
                  log(chalk.red(error))
              }else {
                  log(`It is currently ${data.temperature} degrees out. There is a ${data.precip}% change of rain.`)
              }
          })
        }

    }
)