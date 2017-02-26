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

    $("#nameInp").on("change keyup paste click", function()
    {
        var $inpField =  $(this);

        if(!(/^[A-Z][a-z]*$/.test($inpField.val())) && !($inpField.val() == ""))
            {
                $inpField.addClass("wrongInpBorder");
                $nameErrPrompt = $inpField.parent().find(".namePromptOnErrorInp");
                $nameErrPrompt.removeClass("displayNone");
                $nameErrPrompt.hide();
                $nameErrPrompt.fadeIn(500);
            }
        else
            {
                $inpField.removeClass("wrongInpBorder");
                $nameErrPrompt = $inpField.parent().find(".namePromptOnErrorInp");
                $nameErrPrompt.fadeOut(500);
                $nameErrPrompt.addClass("displayNone");
            }

    });

    $("#phoneInp").on("change keyup paste click", function()
    {
        var $inpField =  $(this);

        if(!(/^(\+380|0)[0-9]{9}$/.test($inpField.val())) && !($inpField.val() == ""))
        {
            $inpField.addClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".phonePromptOnErrorInp");
            $nameErrPrompt.removeClass("displayNone");
            $nameErrPrompt.hide();
            $nameErrPrompt.fadeIn(500);
        }
        else
        {
            $inpField.removeClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".phonePromptOnErrorInp");
            $nameErrPrompt.fadeOut(500);
            $nameErrPrompt.addClass("displayNone");
        }

    });

    $("#addressInp").on("change keyup paste click", function()
    {
        var $inpField =  $(this);

        if(!(/([A-Z]{1}[a-z]*\,\s){2}[1-9][0-9]?[0-9]?$/.test($inpField.val())) && !($inpField.val() == ""))
        {
            $inpField.addClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".addressPromptOnErrorInp");
            $nameErrPrompt.removeClass("displayNone");
            $nameErrPrompt.hide();
            $nameErrPrompt.fadeIn(500);
        }
        else
        {
            $inpField.removeClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".addressPromptOnErrorInp");
            $nameErrPrompt.fadeOut(500);
            $nameErrPrompt.addClass("displayNone");
        }

    });

});