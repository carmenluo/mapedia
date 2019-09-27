var slideIndex = 1;
// showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  // document.getElementById("favSlides").style.display = 'block';
  let slides = document.getElementById("favSlides").children;
  document.getElementById("favSlides").style.visibility = "visible";
  // var dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  // for (i = 0; i < dots.length; i++) {
  //     dots[i].className = dots[i].className.replace(" active", "");
  // }
  slides[slideIndex - 1].style.display = "block";
  // dots[slideIndex - 1].className += " active";
}
$(()=>{

  $('.next').click(()=>{
    plusSlides(1);
  })
  $('.prev').click(()=>{
    plusSlides(-1);
  })
})

$('body').on('DOMNodeInserted', 'a', function () {
  plusSlides(1);
});
