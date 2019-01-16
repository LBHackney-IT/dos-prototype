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
        addAddAnotherButton($wrapper, noun);
        $wrapper.on('click', '.js-form-add-another__button', function(e) {
            e.preventDefault();
            addAnotherInstance($(this), $wrapper);
        });
    }
    
    var addAddAnotherButton = function($wrapper, noun) {
        var button = '<button class="js-form-add-another__button govuk-button">Add another ' + noun + '</button>';
        $wrapper.append(button);
    }
    
    var addAnotherInstance = function($button, $wrapper) {
        var $instance = $wrapper.find('.js-form-add-another__instance').last();
        var $clone = $instance.clone();
        var $number = $clone.find('.js-form-add-another__number');
        var newNumber = $number.text().incrementNumber();
        $clone = incrementNameAttributes($clone, newNumber);
        $number.text(newNumber);
        $button.before($clone);
    }

    var incrementNameAttributes = function($clone, newNumber) {
        $clone.find("[name]").each(function() {
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