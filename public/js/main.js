$(document).ready(function(){

  $('.submit').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    var usern = $('.username-input').val();
    var passw = $('.password-input').val();

    if (usern === '') {
      $('.username-input').addClass('error');
    } else {
      $('.username-input').removeClass('error');
    }
    if (passw === '') {
      $('.password-input').addClass('error');
    } else {
      $('.password-input').removeClass('error');
    }
  });

  $('.toggler').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    if($(this).hasClass('visible')) {
      $('.sidebar').show('slide', {direction: 'left'}, 500);
      $(this).removeClass('visible');
    } else {
      $('.sidebar').hide('slide', {direction: 'left'}, 1000);
      $(this).addClass('visible');
    }



  });
});
