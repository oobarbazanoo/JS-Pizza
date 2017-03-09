/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List'),
    LIQPAY_PUBLIC_KEY = "i24647651569",
    LIQPAY_PRIVATE_KEY = "FO7G9NNiuC1xUar4yg6eNSGbFhV6lreg3Ibb8qAV";

function base64(str)
{
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');
function sha1(string)
{
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.getPizzaList = function(req, res)
{
    res.send(Pizza_List);
};

exports.createOrder = function(req, res)
{
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var order =
    {
        version: 3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: countSumToPay(order_info.ordered),
        currency: "UAH",
        //В описі замовлення мають бути перелічені всі піци які замовила людина, її ім’я, телефон та адреса доставки
        description: generateDescription(order_info),
        order_id: Math.random(),
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature =	sha1(LIQPAY_PRIVATE_KEY	+ data + LIQPAY_PRIVATE_KEY);


    res.send
    ({
        success: true,
        data: data,
        signature: signature
    });
};


function countSumToPay(ordered)
{
    var sum = 0;

    ordered.forEach(function(cartItem)
    {sum += cartItem.price;});

    return sum;
}

String.prototype.replaceAt=function(index, character)
{
    return this.substr(0, index) + character + this.substr(index+character.length);
}
function generateDescription(orderInfo)
{
    var description = "Pizza: ";

    orderInfo.ordered.forEach(function(cartItem)
    {
       description += cartItem.pizza.title + "(" + detectSizeName(cartItem) +"), ";
    });

    description = description.replaceAt(description.length-2, '.') + "\n";

    description += "Name: " + orderInfo.name + ". ";

    description += "Phone: " + orderInfo.phone + ". ";

    description += "Address: " + orderInfo.address + ". ";

    return description;
}
function detectSizeName(cartItem)
{
    if(cartItem.size == "big_size")
    {return "big";}

    return "small";
}