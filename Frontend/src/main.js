/**
 * Created by chaika on 25.01.16.
 */

$(function()
{
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

    setInterval(updateTime, 1000);
    function updateTime()
    {
        var rightNow = new Date(),
            hours = rightNow.getHours(),
            minutes = rightNow.getMinutes(),
            seconds = rightNow.getSeconds(),
            timeToSet = hours + ":" + minutes + ":" + seconds;

        $("#time").html(timeToSet);
    }

    setInterval(rotateNewPopular, 7000);
    function rotateNewPopular()
    {
        $(".labelForSpecialCase").toggleClass("rotate");
    }

    setInterval(scaleStickers, 8000);
    function scaleStickers()
    {
        $(".stickerTop").toggleClass("scale");
        $(".stickerBottom").toggleClass("scale");
    }
});