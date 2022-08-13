const urlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const shortid = require('shortid')

const baseUrl = 'http://localhost:3000'

const urlShortner = async(req, res) => {
    const {
        longUrl
    } = req.body // destructure the longUrl from req.body.longUrl

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).send('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortid.generate()

    // check long url if valid using the validUrl.isUri method
    if (validUrl.isUri(longUrl)) {
        try {
            /* The findOne() provides a match to only the subset of the documents 
            in the collection that match the query. In this case, before creating the short URL,
            we check if the long URL was in the DB ,else we create it.
            */
            let url = await urlModel.findOne({
                longUrl
            })

            // url exist and return the respose
            if (url) {
                res.send(url)
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                // invoking the Url model and saving to the DB
                url = new urlModel({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                })
                await url.save()
                res.send(url)
            }
        }
        // exception handler
        catch (err) {
            console.log(err)
            res.status(500).send('Server Error')
        }
    } else {
        res.status(401).send('Invalid longUrl')
    }
}

module.exports.urlShortner = urlShortner

const getUrlShortner = async(req, res) => {
    try {
        // find a document match to the code in req.params.code
        const url = await urlModel.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.longUrl)
        } else {
            // else return a not found 404 status
            return res.status(404).json('No URL Found')
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
}

module.exports.getUrlShortner = getUrlShortner