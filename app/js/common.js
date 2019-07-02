(function($) {

    $(".slider .owl-carousel").owlCarousel({
        loop:true,
        nav: true,
        dots: false,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        items : 1,
        navText: [],
        responsive: {
            0: {
                items: 1,
                dots: true,
                nav: false
            },
            480: {
                items: 1
            }
        }
    });

})(jQuery);
