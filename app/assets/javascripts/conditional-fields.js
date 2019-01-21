(function () {
  'use strict'

  
  $(document).ready(function() {
    var $wrappers = $('.js-conditional-fields');
    $wrappers.each(function() {
      var wrapper = new conditionalField($(this));
      wrapper.init();
    });
  });

  function conditionalField($wrapper) {
    this.$operator = $wrapper.find('> .js-conditional-fields__operator');
    this.$fieldGroups = $wrapper.find('> .js-conditional-fields__fields');

    this.init = function() {
      var self = this;
      self.hideAllFields();
      self.$operator.on('change', function(event) {
        self.hideAllFields();
        var value = $(event.target).val();
        self.openFieldGroups(value);
      });
    }

    this.hideAllFields = function() {
      var self = this;
      self.$fieldGroups.hide();
    }
    
    this.openFieldGroups = function(value) {
      var self = this;
      var $activeFieldGroup = self.$fieldGroups.filter('[data-conditional-fields-for="' + value + '"]');
      $activeFieldGroup.show();
    }
  }
  return this;
  
})()