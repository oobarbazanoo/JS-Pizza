/**
 * Created by chaika on 25.01.16.
 */

$(function()
{
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var API = require('./API');

    API.getPizzaList(function(err, data)
    {
        if(err)
        {
            var Pizza_List = require('./Pizza_List');
            PizzaMenu.initialiseMenu(Pizza_List);
            return;
        }
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

    var allowOutOfRegexStyle = false;
    $("#addressInp").on("change keyup paste click", function()
    {
        var $inpField =  $(this);

        if( (!(/([A-Z]{1}[a-z]*\,\s){2}[1-9][0-9]?[0-9]?$/.test($inpField.val())) && !($inpField.val() == "")) && (!allowOutOfRegexStyle))
        {
            $inpField.addClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".addressPromptOnErrorInp");
            $nameErrPrompt.removeClass("displayNone");
            $nameErrPrompt.hide();
            $nameErrPrompt.fadeIn(800);
            setTimeAndAddressToUnknown();
        }
        else
        {
            allowOutOfRegexStyle = false;
            $inpField.removeClass("wrongInpBorder");
            $nameErrPrompt = $inpField.parent().find(".addressPromptOnErrorInp");
            $nameErrPrompt.fadeOut(800);
            $nameErrPrompt.addClass("displayNone");

            geocodeAddress($inpField.val(), function(err, coordinates)
            {
                if(err)
                {
                    setTimeAndAddressToUnknown();
                    return;
                }
                calculateRoute(latLangOfTheShop, latLangOfTheDestination(coordinates), function(errInner, obj)
                {
                    if(obj)
                    {
                        setTimeToDeliver(obj.duration.text);
                        calcRoute(latLangOfTheShop, latLangOfTheDestination(coordinates));
                    }
                    else
                    {setTimeToDeliver("unknown")};
                    setAddressToDeliver($inpField.val());
                });
            });
        }
    });

    function setTimeAndAddressToUnknown()
    {
        setTimeToDeliver("unknown");
        setAddressToDeliver("unknown");
    }

    function setTimeToDeliver(newText)
    {$("#timeToDeliver").text(newText);}
    function setAddressToDeliver(newText)
    {$("#addressToDeliver").text(newText);}


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
        console.log(PizzaCart.getPizzaInCart());
        API.createOrder(orderInfo(), showThatInfoWasSent);
    }
    function orderInfo()
    {
        var infoForServer =
            {
                name: $("#nameInp").val(),
                phone: $("#phoneInp").val(),
                address: $("#addressInp").val(),
                ordered: PizzaCart.getPizzaInCart()
            };

        return infoForServer;
    }
    function showThatInfoWasSent(err, data)
    {
        if(err)
        {
            console.log(err);
            return;
        }

        LiqPayCheckout.init
        ({
            data:	data.data,
            signature:	data.signature,
            embedTo:	"#liqpay",
            mode:	"popup"
        }).on("liqpay.callback", function(data)
        {
            console.log(data.status);
            console.log(data);
        }).on("liqpay.ready",	function(data)
        {
            //	ready
        }).on("liqpay.close",	function(data)
        {
            //	close
        });

        console.log("Order is sent! data: ", data);
    }


    var latLangOfTheShop = new	google.maps.LatLng(50.464379,30.519131), directionsDisplay, map;
    google.maps.event.addDomListener(window, 'load', initialize);
    function initialize()
    {

        var styles =
        [
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers:
                [
                    { color: '#1e477d' }
                ]
            }
            ,
            {
            featureType: 'landscape.natural',
            elementType: 'all',
            stylers:
            [
                { color: '#818786' },
            ]
            }
            ,
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    { color: '#36bf3b' },
                ]
            },{
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                { color: '#ff8a24' },
            ]
        },{
            featureType: 'road.local',
            elementType: 'all',
            stylers: [
                { color: '#f2ff3b' },
            ]
        }
        ];

        //Тут починаємо працювати з картою
        var mapProp =
        {
            mapTypeControlOptions:
            {
                mapTypeIds: ['Styled']
            },

            center:	latLangOfTheShop,
            zoom:	11,

            disableDefaultUI: true,
            mapTypeId: 'Styled'
        };
        var html_element =	document.getElementById("googleMap");
        map	= new google.maps.Map(html_element, mapProp);
        directionsDisplay = new google.maps.DirectionsRenderer
        ({
            polylineOptions:
            {
                strokeColor: "#9333bf"
            },
            suppressMarkers : true
        });
        directionsDisplay.setMap(map);
        //Карта створена і показана

        var marker	=	new	google.maps.Marker
        ({
            position: latLangOfTheShop,
            //map - це змінна карти створена за допомогою new google.maps.Map(...)
            map: map,
            icon: "assets/images/map-icon.png"
        });

        google.maps.event.addListener(map,'click',function(me)
        {
            var coordinates	= me.latLng;
            geocodeLatLng(coordinates,	function(err, adress)
            {
                if(!err)
                {
                    //Дізналися адресу
                    setAddressForTheUser(adress);
                }
                else
                {
                    console.log("Немає адреси")
                }
            })
        });

        var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
        map.mapTypes.set('Styled', styledMapType);
    }

    //3. При натисканні в будь-якому місці на карті визначати адресу цього місця, оновлювати
    // значення адреси в полі вводу (+ оновлювати час доставки)
    function setAddressForTheUser(adress)
    {
        var $addressInp = $("#addressInp");
        allowOutOfRegexStyle = true;
        $addressInp.val(adress);
        $addressInp.trigger("change");
    }


    function geocodeLatLng(latlng, callback)
    {
        //Модуль за роботу з адресою address by geocode
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location':	latlng},	function(results,	status)
        {
            if(status === google.maps.GeocoderStatus.OK&&results[1])
            {
                var adress = results[1].formatted_address;
                callback(null, adress);
            }
            else
            {
                callback(new Error("Can't find adress"));
            }
        });
    }
    function geocodeAddress(address, callback)
    {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address':address}, function(results, status)
        {
            if(status === google.maps.GeocoderStatus.OK&&results[0])
            {
                var coordinates	= results[0].geometry.location;
                callback(null, coordinates);
            }
            else
            {
                callback(new Error("Can	not	find the adress"));
            }
        });
    }
    function latLangOfTheDestination(coordinates)
    {return new google.maps.LatLng(coordinates.lat(), coordinates.lng());}
    function calculateRoute(A_latlng, B_latlng,	callback)
    {
        var directionService =	new	google.maps.DirectionsService();
        directionService.route
        ({
            origin:	A_latlng,
            destination: B_latlng,
            travelMode:	google.maps.TravelMode["DRIVING"]
        },
        function(response, status)
        {
            if(status == google.maps.DirectionsStatus.OK)
            {
                var leg = response.routes[0].legs[0];
                callback(null,
                {
                    duration: leg.duration
                });
            }
            else
            {
                callback(new Error("Can not	find direction"));
            }
        });
    }

    var endMarker;
    function calcRoute(start, end)
    {
        // var start = new google.maps.LatLng(37.334818, -121.884886);
        // var end = new google.maps.LatLng(37.441883, -122.143019);
        var request =
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status)
        {
            if(status == google.maps.DirectionsStatus.OK)
            {
                directionsDisplay.setDirections(response);
                if(endMarker)
                {endMarker.setMap(null);}
                endMarker = new google.maps.Marker
                ({
                    position: end,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });
            }
            else
            {
                console.log("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });
    }
});