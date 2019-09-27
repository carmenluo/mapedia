/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 * 
 */

const scrollTop = function () {
    let y = window.scrollY;
    if (y > 0) {
        $("#arrow").css('visibility', 'visible');
    } else {
        $("#arrow").css('visibility', 'hidden');
    }
}
//determine coords to scroll to

$().ready(function () {
    scrollTop();
    window.addEventListener("scroll", scrollTop);
    $('#arrow').on('click', function (e) {
        e.preventDefault();

        scrollTop();
    })
})
