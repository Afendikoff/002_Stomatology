$(function () {

      // Custom JS
      var navMain = document.querySelector('.main-nav');
      var navToggle = document.querySelector('.main-nav__toggle');

      navMain.classList.remove('main-nav--nojs');

      navToggle.addEventListener('click', function () {
        if (navMain.classList.contains('main-nav--closed')) {
          navMain.classList.remove('main-nav--closed');
          navMain.classList.add('main-nav--opened');
        } else {
          navMain.classList.add('main-nav--closed');
          navMain.classList.remove('main-nav--opened');
        }
      });
    })

//слик-слайдер

    $(document).ready(function () {
      $('.reviews-slider').slick({
        infinite: true,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<button class="slider-btn slider-btn--prev" type="button"></button>',
        nextArrow: '<button class="slider-btn slider-btn--next" type="button"></button>',
        responsive: [{
            breakpoint: 1200,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              prevArrow: '<button class="slider-btn slider-btn--prev" type="button"></button>',
              nextArrow: '<button class="slider-btn slider-btn--next" type="button"></button>'
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              prevArrow: '<button class="slider-btn slider-btn--prev" type="button"></button>',
              nextArrow: '<button class="slider-btn slider-btn--next" type="button"></button>'
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });
    });

//плавный скролл
$(document).ready(function () {
  $("#js-service-link").on("click", function(event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: $("#js-service").offset().top - 20
    }, 1000);
    return false;
  });

  $("#js-contacts-link").on("click", function(event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: $("#js-contacts").offset().top - 20
    }, 1000);
    return false;
  });

  $("#js-spec-link").on("click", function(event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: $("#js-spec").offset().top + 2
    }, 1000);
    return false;
  });

  $("#js-reviews-link").on("click", function(event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: $("#js-reviews").offset().top - 20
    }, 1000);
    return false;
  });
});