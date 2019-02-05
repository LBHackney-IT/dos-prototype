const express = require('express')
const router = express.Router()
const categories = require('./data/categories.json')
const cheerio = require('cheerio')
const Airtable = require('airtable')
const async = require('async')

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
    res.render('service_provider_actions', {'dummyListings' : req.query.dummylistings, navigation: providerNavigation});
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
    var localVars = {
        'step' : step, 
        'steps' : steps,
        'backUrl' : backUrl,
        'formData': formData,
        'pcaKey' : process.env.PCA_API_KEY
    };
    async.series([
        function facebook(nextFunction) {
            if(formData['facebook-url'] && formData['facebook-url'] !== '') {
                scrapeFacebook(formData['facebook-url'], function(facebookData){
                    localVars['facebookData'] = facebookData;
                    nextFunction();
                });
            } else {
                nextFunction();
            }
        },
        function stepTwoData(nextFunction) {
            if(step == 'two') {
                getAirtableData('Service Types', function(serviceTypes) {
                    localVars['serviceTypes'] = createTaxonomyHeirachy(serviceTypes);
                    nextFunction();
                });
            } else {
                nextFunction();
            }
        }, function(err){
            if( err ) {
                console.log('Error: '+err);
            }
            console.log(localVars['serviceTypes']);
            res.render('service_submit_provider_' + step, localVars);
        }
    ]);
})

router.all('/service-provider-actions/add-service', function (req, res) {
    res.render('service_provider_add_service');
})

router.all('/service-provider-actions/add-events', function (req, res) {
    res.render('service_provider_add_events');
})

router.all('/service-provider-actions/org-permissions', function (req, res) {
    res.render('service_provider_org_permissions');
})

router.all('/service-provider-actions/confirm', function (req, res) {
    var session = req.session.data;
    console.log(session);
    var message = req.body['confirmation-message'];
    if(!message) {
        message = 'Your information has been saved.';
    }
    var ctas = req.body['ctas'];
    res.render('service_provider_actions', {'title': 'Submission successful','message' : message,  'ctas': ctas, 'session': session, navigation: providerNavigation});
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

getAirtableData = function(table = 'Service Types', callback, baseKey = 'app0B5XjIQSmt8wIo', view = "Grid view") {
    var results = [];
    var base = new Airtable({apiKey: process.env.AIRTABLE_API}).base(baseKey);
    base(table).select({
        view: view
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            results.push(record);
        });
    
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); callback(err); }
        callback(results);
    });
}

createTaxonomyHeirachy = function(airtableData) {
    var items = [];
    airtableData.forEach(function(row) {
        var fields = row.fields;
        // Is a top-level item
        if(typeof fields['Parent identifiers'] == 'undefined') {
            var term = new Term(row.id, fields, airtableData);
            items.push(term);
        }
    })
    return items;
}

Term = function(id, fields, airtableData) {
    this.id = id;
    this.text = fields['Label'];
    this.children = getChildTerms(this.id, airtableData);  
}

getChildTerms = function(parentId, airtableData) {
    var children = [];
    airtableData.forEach(function(row) {
        var fields = row.fields;
        if(typeof fields['Parent identifiers'] !== 'undefined' && 
        fields['Parent identifiers'].includes(parentId)) {
            // console.log(fields['Parent identifiers'] + ' vs ' + parentId);
            var term = new Term(row.id, fields, airtableData);
            children.push(term);
        }
    });
    return children;
}


var providerNavigation = [
    {
    href: "/service-provider/register",
    text: "Your account details"
    },
    {
    href: "/service-provider-actions/submit/one",
    text: "Organisation details"
    },
    {
    href: "/service-provider-actions/org-permissions",
    text: "Organisation permissions"
    }
];

module.exports = router
