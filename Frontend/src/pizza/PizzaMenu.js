/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
// var Pizza_List = require('../Pizza_List');

var Pizza_List;

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list)
{
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    list.forEach(showOnePizza);
    function showOnePizza(pizza)
    {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }
}

$("#showAll").click(function()
{
    filterPizza("all");
    $("nav .btn.standardBtn").removeClass("sortBtnClicked");
    $(this).addClass("sortBtnClicked");
});
$("#showMeat").click(function()
{
    filterPizza("meat");
    $("nav .btn.standardBtn").removeClass("sortBtnClicked");
    $(this).addClass("sortBtnClicked");
});
$("#showPineapple").click(function()
{
    filterPizza("pineapple");
    $("nav .btn.standardBtn").removeClass("sortBtnClicked");
    $(this).addClass("sortBtnClicked");
});
$("#showMushroom").click(function()
{
    filterPizza("mushroom");
    $("nav .btn.standardBtn").removeClass("sortBtnClicked");
    $(this).addClass("sortBtnClicked");
});
$("#showSeafood").click(function()
{
    filterPizza("seafood");
    $("nav .btn.standardBtn").removeClass("sortBtnClicked");
    $(this).addClass("sortBtnClicked");
});
$("#showVegetarian").click(function()
{
    filterPizza("vegetarian");
    $("nav .btn.standardBtn").removeClass("sortBtnClicked");
    $(this).addClass("sortBtnClicked");
});

function filterPizza(filter)
{
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if(filter=="all")
     {
         showPizzaList(Pizza_List);
         return;
     }

    Pizza_List.forEach(function(pizza)
    {
        pizza.types.forEach(function(type)
        {
            if(type == filter)
            {pizza_shown.push(pizza);}
        });

    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu(data)
{
    //Показуємо усі піци

    Pizza_List = data;

    showPizzaList(data)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;