const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.get('/data-listing', function (req, res) {
    res.render('data_listing', {'message' : 'Hello world'});
});

app.get('/data-listing/:serviceId/edit', function (req, res) {
    res.render('service_edit', {'serviceId' : req.params.serviceId});
})

app.get('/data-listing/:serviceId/out-of-date', function (req, res) {
    res.render('service_out_of_date', {'serviceId' : req.params.serviceId});
})

app.get('/data-listing/:serviceId/update', function (req, res) {
    res.render('service_update', {'serviceId' : req.params.serviceId});
})

module.exports = router
