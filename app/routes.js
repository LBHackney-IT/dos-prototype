const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.get('/data-listing', function (req, res) {
    res.render('data_listing');
});

router.get('/data-listing/:serviceId/edit', function (req, res) {
    res.render('service_edit', {'serviceId' : req.params.serviceId});
})

router.get('/data-listing/:serviceId/out-of-date', function (req, res) {
    res.render('service_out_of_date', {'serviceId' : req.params.serviceId});
})

router.get('/data-listing/:serviceId/update', function (req, res) {
    res.render('service_update', {'serviceId' : req.params.serviceId});
})

router.get('/data-listing/:serviceId/submission', function (req, res) {
    res.render('service_submission', {'serviceId' : req.params.serviceId});
})

router.get('/service-provider-actions', function (req, res) {
    res.render('service_provider_actions');
})

router.get('/service-provider-actions/:serviceId/out-of-date', function (req, res) {
    res.render('service_out_of_date_provider', {'serviceId' : req.params.serviceId});
})

router.get('/service-provider-actions/:serviceId/edit', function (req, res) {
    res.render('service_edit_provider', {'serviceId' : req.params.serviceId});
})

router.get('/service-provider-actions/submit', function (req, res) {
    res.render('service_submit_provider');
})

module.exports = router
