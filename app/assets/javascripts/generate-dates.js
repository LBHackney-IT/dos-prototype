(function () {
  'use strict'

  
  $(document).ready(function() {
    var $wrappers = $('.js-generate-dates');
    $wrappers.each(function() {
      var wrapper = new generateDates($(this));
      wrapper.init();
    });
  });

  function generateDates($wrapper) {
    this.$wrapper = $wrapper;
    
    this.init = function() {
      var self = this;
    }

    this.generate = function() {
      var startDate = getStartDate();
      var startTime = getStartTime();
      var endDate = getEndDate();
      var endTime = getEndTime();
    }

    this.getStartDate = function(){
      var self = this;
      var startDate = {};
      startDate.day = self.$wrapper.find('#events[1][start-date]-day').val();
      startDate.month = self.$wrapper.find('#events[1][start-date]-month').val();
      startDate.year = self.$wrapper.find('#events[1][start-date]-year').val();
      return startDate.day + '/' + startDate.month + '/' + startDate.year;
    };
    
    this.getStartTime = function() {
      var self = this;
      return self.$wrapper.find('#events[1][start-time]').val(); 
    }

    this.getEndDate = function(){
      var self = this;
      var endDate = {};
      endDate.day = self.$wrapper.find('#events[1][end-date]-day').val();
      endDate.month = self.$wrapper.find('#events[1][end-date]-month').val();
      endDate.year = self.$wrapper.find('#events[1][end-date]-year').val();
      return endDate.day + '/' + endDate.month + '/' + endDate.year;;
    };

    this.getEndTime = function() {
      var self = this;
      return self.$wrapper.find('#events[1][end-time]').val(); 
    }


  }
  return this;
  
})()