$(document).ready(function(){

  $('.search').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    var query = $('.search-input').val();

    if (query === '') {
      $('.search-input').addClass('error');
    } else if (query.indexOf('#') !== -1){
      $('.search-input').addClass('error');
    } else {
      $('.search-input').removeClass('error');
    }
  });

  $('.toggler').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    if($(this).hasClass('visible')) {
      $('.sidebar').hide('slide', {direction: 'left'}, 1000);
      $(this).removeClass('visible');
    } else {
      $('.sidebar').show('slide', {direction: 'left'}, 1000);
      $(this).addClass('visible');
    }



  });
});
