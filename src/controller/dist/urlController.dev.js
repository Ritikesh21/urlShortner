"use strict";

var urlModel = require('../models/urlModel');

var validUrl = require('valid-url');

var shortid = require('shortid');

var baseUrl = 'http://localhost:3000';

var urlShortner = function urlShortner(req, res) {
  var longUrl, urlCode, url, shortUrl;
  return regeneratorRuntime.async(function urlShortner$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          longUrl = req.body.longUrl; // destructure the longUrl from req.body.longUrl
          // check base url if valid using the validUrl.isUri method

          if (validUrl.isUri(baseUrl)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(401).send('Invalid base URL'));

        case 3:
          // if valid, we create the url code
          urlCode = shortid.generate(); // check long url if valid using the validUrl.isUri method

          if (!validUrl.isUri(longUrl)) {
            _context.next = 26;
            break;
          }

          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(urlModel.findOne({
            longUrl: longUrl
          }));

        case 8:
          url = _context.sent;

          if (!url) {
            _context.next = 13;
            break;
          }

          res.send(url);
          _context.next = 18;
          break;

        case 13:
          // join the generated short code the the base url
          shortUrl = baseUrl + '/' + urlCode; // invoking the Url model and saving to the DB

          url = new urlModel({
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode,
            date: new Date()
          });
          _context.next = 17;
          return regeneratorRuntime.awrap(url.save());

        case 17:
          res.send(url);

        case 18:
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](5);
          console.log(_context.t0);
          res.status(500).send('Server Error');

        case 24:
          _context.next = 27;
          break;

        case 26:
          res.status(401).send('Invalid longUrl');

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 20]]);
};

module.exports.urlShortner = urlShortner;

var getUrlShortner = function getUrlShortner(req, res) {
  var url;
  return regeneratorRuntime.async(function getUrlShortner$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(urlModel.findOne({
            urlCode: req.params.urlCode
          }));

        case 3:
          url = _context2.sent;

          if (!url) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.redirect(url.longUrl));

        case 8:
          return _context2.abrupt("return", res.status(404).json('No URL Found'));

        case 9:
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json('Server Error');

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports.getUrlShortner = getUrlShortner;