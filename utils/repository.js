const redis = require("redis");
const request = require('request');
const REDIS_PORT = process.env.PORT || 6379

const db = redis.createClient(REDIS_PORT);

const PUSH_ENDPOINT_URI = 'http://localhost:3000/data_pipe'

db.on("error", function (error) {
    console.error(error);
});
let count = 1
let toCache = (data) => {
    count = count + 1
    let uid = 'enam'

    db.get(uid, (err, value) => {
        if (err) console.log(err)
        if (value !== null) {
            let parsedData = JSON.parse(value)
            parsedData.unshift(data)
            let itemLength = parsedData.length
            if (itemLength >= 100) {
                parsedData.pop()
            }
            console.log(`======== ${itemLength} ==========`)
            db.set(uid, JSON.stringify(parsedData))
        } else {
            let x = []

            x.push(data)
            db.set(uid, JSON.stringify(x))
        }
    })
}
let toDatabase = (data) => {
    if (data) {

        var options = {
            uri: PUSH_ENDPOINT_URI,
            method: 'POST',
            json: true,
            body: data
        }
        request(options ,(err,res,body)=>{
            console.log(err,body)
        })
    } else console.log('Null data cant be send to database : ', data)

}


let getSinglePatient = (req, res) => {
    const id = req.query.id
    if (id) {
        db.get(id, (error, data) => {
            if (error) return res.status(404).json({ error: error })
            else if (id === null) {
                return res.status(404).json({ error: "Patient id is not valid or not passed through request. ex. api/get_patient_info?id=JDJF*^%FFHF&*" })
            } else {
                return res.status(200).json(JSON.parse(data))

            }
        })
    } else {
        return res.status(404).json({ error: "Patient id is not valid or not passed through request. ex. api/get_patient_info?id=JDJF*^%FFHF&*" })
    }


}
module.exports = { db, toCache, toDatabase, getSinglePatient }