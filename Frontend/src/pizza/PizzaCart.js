/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

Storage.prototype.setObject = function(key, value)
{this.setItem(key, JSON.stringify(value));}

Storage.prototype.getObject = function(key)
{return JSON.parse(this.getItem(key));}

//Перелік розмірів піци
var PizzaSize =
{
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = localStorage.getObject("Cartt")
if(!Cart)
{Cart = [];}

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size)
{
    var leaveTheMethod = false;
    Cart.forEach(function(cartItem)
    {
        if(pizzaAndSizeAreTheSame(cartItem, pizza, size))
        {
            cartItem.quantity++;
            cartItem.price+= pizza[size].price;
            updateCart();
            leaveTheMethod = true;
        }
    });
    if(leaveTheMethod)
        {return;}

    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом
    Cart.push
    ({
        pizza: pizza,
        size: size,
        quantity: 1,
        price: pizza[size].price
    });

    //Оновити вміст кошика на сторінці
    updateCart();
}

function pizzaAndSizeAreTheSame(cartItem, pizza, size)
{
    return (cartItem.pizza == pizza)&&(cartItem.size == size);
}


function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart()
{
    localStorage.setObject("Cartt", Cart);

    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    var totalSumToPay = 0;

    Cart.forEach(showOnePizzaInCart);
    function showOnePizzaInCart(cart_item)
    {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);

        $node.find(".add").click(function()
        {
            cart_item.quantity += 1;
            cart_item.price += cart_item.pizza[cart_item.size].price;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".subtract").click(function()
        {
            if(cart_item.quantity == 1)
                {
                    var indexToDelete = Cart.indexOf(cart_item);
                    Cart.splice(indexToDelete, 1);
                }
            else
                {
                    cart_item.quantity -= 1;
                    cart_item.price -= cart_item.pizza[cart_item.size].price;
                }

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".cancel").click(function()
        {
            var indexToDelete = Cart.indexOf(cart_item);
            Cart.splice(indexToDelete, 1);

            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);

        totalSumToPay+=cart_item.price;
    }

    $("#totalSumToPay").text(totalSumToPay + "$");
    $("#numberOfOrdered").text(Cart.length);

    if(Cart.length == 0)
        {
            $("#emptyBox").css("display", "inline-block");
        }
    else
        {
            $("#emptyBox").css("display", "none");
        }
}

$("#denyOrdered").click(function ()
{
    Cart = [];
    updateCart();
});


exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;