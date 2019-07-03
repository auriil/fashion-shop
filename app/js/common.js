(function($) {

    var headerSearch = document.querySelector('.header__search');
    var body = document.querySelector('body');

    headerSearch.addEventListener('click', function (event) {
        event.stopPropagation();
        this.classList.add('header__search--active');
    });

    body.addEventListener('click', function () {
        headerSearch.classList.remove('header__search--active');
    });

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

    $(".carousel").owlCarousel({
        loop:true,
        nav: true,
        dots: false,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        items : 1,
        margin: 30,
        navText: [],
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            480: {
                items: 2
            },
            680: {
                items: 3
            },
            1024: {
                items: 4
            }
        }
    });

})(jQuery);
