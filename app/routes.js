const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.get('/data-listing', function (req, res) {
    res.render('data_listing', {'message' : 'Hello world'});
});

module.exports = router
