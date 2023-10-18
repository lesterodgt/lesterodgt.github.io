$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
    var target = $(this.hash);
    if (target.length) {
        $("html, body").animate(
        {
            scrollTop: target.offset().top
        },
        1000
        );
    }
    });

    flatpickr("#dash-daterange", {
        altInput: !0,
        altFormat: "j F Y",
        dateFormat: "d-m-Y",
        defaultDate: "today",
        locale: "es",
        onChange: function(dateObj, dateStr){
            date = new Date();
            $("#dash-daterange").text(date.toString());
            console.info(date.toString());
        }
    });
});


