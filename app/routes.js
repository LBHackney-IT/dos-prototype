const express = require('express')
const router = express.Router()
const categories = require('./data/categories.json')

// Add your routes here - above the module.exports line
router.all('/data-listing', function (req, res) {
    res.render('data_listing');
});

router.all('/data-listing/:serviceId/edit', function (req, res) {
    res.render('service_edit', {'serviceId' : req.params.serviceId, 'categories' : categories.results});
})

router.all('/data-listing/:serviceId/out-of-date', function (req, res) {
    res.render('service_out_of_date', {'serviceId' : req.params.serviceId});
})

router.all('/data-listing/:serviceId/update', function (req, res) {
    res.render('service_update', {'serviceId' : req.params.serviceId});
})

router.all('/data-listing/:serviceId/submission', function (req, res) {
    res.render('service_submission', {'serviceId' : req.params.serviceId, 'categories' : categories.results});
})

router.all('/service-provider-actions', function (req, res) {
    res.render('service_provider_actions');
})

router.all('/service-provider-actions/:serviceId/out-of-date', function (req, res) {
    res.render('service_out_of_date_provider', {'serviceId' : req.params.serviceId});
})

router.all('/service-provider-actions/:serviceId/edit', function (req, res) {
    res.render('service_edit_provider', {'serviceId' : req.params.serviceId});
})

router.all('/service-provider-actions/submit/:step', function (req, res) {
    var step = req.params.step;
    var steps = 'six';
    res.render('service_submit_provider_' + step, 
    {
        'step' : step, 
        'steps' : steps
    });
})

router.all('/service-provider-actions/confirm', function (req, res) {
    res.render('service_provider_actions', {'title': 'Submission successful','message' : 'You\'ll recieve an email shortly.'});
})

router.all('/api/url-exists', function (req, res) {
    var urlExists = require('url-exists');
    var url = req.query.url;
    urlExists(url, function(err, exists) {
        if (exists) {
            res.send(exists);
        } else {
            res.status(500).send(exists)
        }
    });

})

module.exports = router
