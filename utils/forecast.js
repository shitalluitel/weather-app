const request = require('request')
const settings = require('../config/settings')

const forecast = (latLong, callback) => {
    request(
        settings.weatherstack.url,
        {
            method: 'GET',
            json: true,
            qs: {
                access_key: settings.weatherstack.api,
                query: latLong
            }
        },
        (error, {body}) => {
            if (error){
                callback('Unable to reach weather stack api.', undefined)
            }else if(body.error){
                callback('Unable to fetch data from weather stack.', undefined)
            }else{
                callback(undefined, body.current)
            }
        }
    )
}

module.exports = forecast