const express = require('express')
const router = express.Router()
const {urlShortner, getUrlShortner} = require('../controller/urlController')

router.post('/url/shorten', urlShortner)

router.get('/:urlCode', getUrlShortner)

router.all("*" , (req,res)=>{
    res.status(404).send({ msg:"NOT FOUND THIS URL"})
})

module.exports = router