import { appendMap, appendSearch, checkMapCollections } from "./helpers.js";

$(function($) {
  $("#homepage header nav .login").click(function() {
    if ($("#login-form").css("display") == "none") {
      $("#login-form").slideDown();
    } else {
      $("#login-form").slideUp();
    }
  });
  $("#homepage header nav .signup").click(function() {
    // alert("hiiii");
    if ($("#singup").css("display") == "none") {
      $("#singup").slideDown();
    } else {
      $("#singup").slideUp();
    }
  });

  
  $.ajax({
    method: "GET",
    url: "/"
  }).done(() => {
    $("#map").append(appendMap());
    $("#searchPlace").click(function() {
      appendSearch();
    });
  });

  $(".item").click(function() {
    let url = $(this).attr("href");
    alert(url);
    $("#right").load(url);
    return false;
  });
});
