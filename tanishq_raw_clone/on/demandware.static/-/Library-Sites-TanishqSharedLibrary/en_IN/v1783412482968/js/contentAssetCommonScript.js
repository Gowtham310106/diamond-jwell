/* All Content asset common JS Goes Here .. */

// cookie-alert

 document.addEventListener("DOMContentLoaded", function () {
    const bar = document.querySelector(".notification-top-bar");
    const closeBtn = document.querySelector(".cross-sticky");

    if (!bar) return;

    // Show bar (remove d-none if needed)
    bar.classList.remove("d-none");

    // Auto hide after 2 seconds
    setTimeout(() => fadeOut(bar), 2000);

    // Hide immediately on close button click
    if (closeBtn) {
        closeBtn.addEventListener("click", () => fadeOut(bar));
    }

    function fadeOut(element) {
        element.style.transition = "opacity 1.5s ease";
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.display = "none";
        }, 1500);
    }
});

// **********END**********


// homepage-tanishq-assurance-carousel
document.addEventListener("DOMContentLoaded", function () {
    var $slider = $('.home-tq-assurance-slider');
    if (!$slider.hasClass('slick-initialized')) {
        $slider.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: true,
            infinite: true,
            autoplay: false,
            arrows: true
        });
    }
    var assuranceTotalSlides= $('.home-tq-assurance-slider .assurance-item-con').length;
    if (assuranceTotalSlides <= 3) {
        $('.home-tq-assurance-slider .slick-dots').addClass('d-none');
    }
});

// **********END**********


// homepage-generic-css

document.addEventListener('DOMContentLoaded', function() {
  document
    .querySelectorAll('.pd-layout-swiper-slider a.w-100.h-100.d-flex')
    .forEach(function(anchor) {
      anchor.classList.remove('w-100', 'h-100', 'd-flex');
    });
});

// **********END**********

// Fix for the Delivery dates coming twice if prebook is isPrebookOrderApplied

// $(document).ajaxComplete(function () {
//     var isPrebookOrderApplied = $('.isprebookorderapplied').val();
//     if (isPrebookOrderApplied === 'true' && !$('.delivery-status-prebook').hasClass('d-none')) {
//         $('.delivery-status').removeClass('d-flex').addClass('d-none');
//     }
// });

// Fix for the prebook checkbox click event in PDP Page
// $(document).ready(function () {  
//     $('body').on('click', '#checkPrebookDelivery', function (e) {
//         if ($(this).is(':checked')) {
//             $('#prebookDeliverySelect').show();
//         } else {
//             $('#prebookDeliverySelect').hide();
//         }
//     });
//     $('body').on('click', '.remove-prebook', function () {
//         sessionStorage.setItem('prebookselected', false);
//     });
// });