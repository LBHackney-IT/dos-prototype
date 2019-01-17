const express = require('express')
const router = express.Router()
const categories = require('./data/categories.json')
const cheerio = require('cheerio')

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
    res.render('service_provider_actions', {'dummyListings' : req.query.dummylistings});
})

router.all('/service-provider-actions/:serviceId/out-of-date', function (req, res) {
    res.render('service_out_of_date_provider', {'serviceId' : req.params.serviceId});
})

router.all('/service-provider-actions/:serviceId/edit', function (req, res) {
    res.render('service_edit_provider', {'serviceId' : req.params.serviceId});
})

router.all('/service-provider-actions/submit/:step', function (req, res) {
    var step = req.params.step;
    var steps = 'four';
    var backUrl = getPreviousStepUrl(step);
    var formData = req.body;
    if(formData['facebook-url'] && formData['facebook-url'] !== '') {
        scrapeFacebook(formData['facebook-url'], function(facebookData){
            res.render('service_submit_provider_' + step, 
            {
                'step' : step, 
                'steps' : steps,
                'backUrl' : backUrl,
                'formData': formData,
                'facebookData' : facebookData
            });    
        });
    } else {
        res.render('service_submit_provider_' + step, 
        {
            'step' : step, 
            'steps' : steps,
            'backUrl' : backUrl,
            'formData': formData
        });
    }
})

router.all('/service-provider-actions/add-service', function (req, res) {
    res.render('service_provider_add_service');
})

router.all('/service-provider-actions/add-events', function (req, res) {
    res.render('service_provider_add_events');
})

router.all('/service-provider-actions/confirm', function (req, res) {
    var message = req.body['confirmation-message'];
    if(!message) {
        message = 'Your information has been saved.';
    }
    res.render('service_provider_actions', {'title': 'Submission successful','message' : message});
})

router.all('/service-provider/register', function (req, res) {
    res.render('provider_register');
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

scrapeFacebook = function(url, cb) {
    var request = require('request');
    const $ = require('cheerio');
    request(url,
    {
        headers: {
        'user-agent': 'curl/7.47.0',
        'accept-language': 'en-US,en',
        'accept': '*/*'
        }
    }, function (error, response, body) {
        if (error) {
        throw (error);
        }
        if (response.statusCode === 200) {
        const $ = cheerio.load(body)
        let facebookData = {};
        facebookData.title = $('#pageTitle').text().replace(' | Facebook', '');
        facebookData.description = $("meta[name='description']").attr("content")
        cb(facebookData);
        } else {
        console.log('HTTP Error: ' + response.statusCode);
        }
    });
}

getPreviousStepUrl = function(currentStep) {
    switch (currentStep) {
        case 'one':
            return '/service-provider-actions'
            break;
        case 'two':
            return './one'
            break;
        case 'three':
            return './two'
            break;
        case 'four':
            return './three'
            break;
        default:
            return '/service-provider-actions';
    }
}

module.exports = router
