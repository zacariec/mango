// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionPosition: 'left'
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
};

function closeSuggestionMobile(searchBoxId, isCloseSearchBox) {
  /* console.log('closeSuggestionMobile'); */
  jQ(searchBoxId).autocomplete('close');
  jQ('.' + bcsffilter.class.searchSuggestion + '[data-search-box="' + searchBoxId + '"]').parent().hide();
  // Remove search box
  var isCloseSearchBox = typeof isCloseSearchBox !== 'undefined' ? isCloseSearchBox : false;
  if (isCloseSearchBox) jQ('.bc-sf-search-suggestion-mobile-top-panel,.bc-sf-search-suggestion-mobile-overlay').hide();
  // Update current term for all search boxes
  setValueAllSearchBoxes();
  // Add back tabindex=-1
  jQ('.bc-sf-search-no-tabindex').attr('tabindex', -1);
  // Return scrolling of body
  if(jQ('body').hasClass(bcsffilter.getClass('searchSuggestionMobileOpen'))){    
    jQ('body').removeClass(bcsffilter.getClass('searchSuggestionMobileOpen'));
  }
  bcsffilter.afterCloseSuggestionMobile(searchBoxId, isCloseSearchBox);
  
  // Close search theme debut
  if(jQ('.js-drawer-close').length > 1){
    jQ('.js-drawer-close').trigger('click');
  }
}