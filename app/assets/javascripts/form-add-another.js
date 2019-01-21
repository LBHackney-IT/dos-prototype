(function () {
    'use strict'

    var $wrappers;

    $(document).ready(function() {
        $wrappers = $('.js-form-add-another');
        $wrappers.each(function() {
            init($(this));
        });
    });

    var init = function($wrapper) {
        var noun = $wrapper.attr('data-form-add-another-noun');
        if(noun == null) {
            noun = 'item';
        }
        var $button = addAddAnotherButton($wrapper, noun);
        $button.on('click', function(e) {
            e.preventDefault();
            addAnotherInstance($button, $wrapper);
        });
    }
    
    var addAddAnotherButton = function($wrapper, noun) {
        var $button = $('<button class="js-form-add-another__button govuk-button">Add another ' + noun + '</button>');
        $wrapper.append($button);
        return $button;
    }
    
    var addAnotherInstance = function($button, $wrapper) {
        var $instance = $wrapper.find('> .js-form-add-another__instance').last();
        var $clone = $instance.clone();
        var $number = $clone.find('.js-form-add-another__number').first();
        var newNumber = $number.text().incrementNumber();
        $clone = incrementNameAttributes($clone, newNumber);
        $number.text(newNumber);
        $button.before($clone);
    }

    var incrementNameAttributes = function($clone, newNumber) {
        var fields = $clone.find('[name]').not('.js-form-add-another__instance [name]');
        fields.each(function() {
            var $this = $(this);
            var name = $this.attr('name');
            var newName = name.replace(/\d+/, newNumber);
            $this.attr('name', newName);
        });
        return $clone;
    }

    if(!String.prototype.incrementNumber) {
        String.prototype.incrementNumber = function (string) {
            var newNumber = Number(this);
            newNumber++;
            return newNumber.toString();
        };
    }
})()