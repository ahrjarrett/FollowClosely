$(window).scroll(function() {
  var sticky = $('.sticky'),
    scroll = $(window).scrollTop();

  if (scroll >= 500) sticky.addClass('fixed');
  else sticky.removeClass('fixed');
});