/**
 * Created by chaika on 25.01.16.
 */

$(function()
{
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    // var Pizza_List = require('./Pizza_List');
    var API = require('./API');

    API.getPizzaList(function(err, data)
    {
        PizzaMenu.initialiseMenu(data);
    });

    PizzaCart.initialiseCart();

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
                $nameErrPrompt.fadeIn(800);
            }
        else
            {
                $inpField.removeClass("wrongInpBorder");
                $nameErrPrompt = $inpField.parent().find(".namePromptOnErrorInp");
                $nameErrPrompt.fadeOut(800);
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
            $nameErrPrompt.fadeIn(800);
        }
        else
        {
            $inpField.removeClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".phonePromptOnErrorInp");
            $nameErrPrompt.fadeOut(800);
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
            $nameErrPrompt.fadeIn(800);
        }
        else
        {
            $inpField.removeClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".addressPromptOnErrorInp");
            $nameErrPrompt.fadeOut(800);
            $nameErrPrompt.addClass("displayNone");
        }

    });


    $("#ContinueButton").click(function()
    {
        if(allFieldsOk())
        {sendInfoToServer();}
    });
    function allFieldsOk()
    {
        if($("#nameInp").hasClass("wrongInpBorder"))
            {return false;}

        if($("#phoneInp").hasClass("wrongInpBorder"))
            {return false;}

        if($("#addressInp").hasClass("wrongInpBorder"))
            {return false;}

        if($("#nameInp").val().length == 0)
            {return false;}

        if($("#phoneInp").val().length == 0)
            {return false;}

        if($("#addressInp").val().length == 0)
            {return false;}

        return true;
    }
    function sendInfoToServer()
    {
        API.createOrder(orderInfo(), showThatInfoWasSent);
    }
    function orderInfo()
    {
        return
        {
            name: $("#nameInp").val();
            phone: $("#phoneInp").val();
            address: $("#addressInp").val();
        }
    }
    function showThatInfoWasSent()
    {
        console.log("Order is sent!");
    }

});