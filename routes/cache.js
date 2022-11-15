const JSONdb = require("simple-json-db");
module.exports = {
    getCartById: function (cartId) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data.cart.filter(obj => {
            return obj.cartId.toString() === cartId;
        })
    },
    addToCartCache:function (cartItem) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        data.cart.push(data);
        db.JSON(data);
        db.sync();

    },
    cache:function () {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data;
    },
    clearDataCache:function () {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        data.data = [];
        db.JSON(data);
        db.sync();
    },
    clearCartCache:function (){
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        data.cart = [];
        db.JSON(data);
        db.sync();
    },
    addToDataCache:function(dataItem) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        data.data.push(dataItem);
        db.JSON(dataItem);
        db.sync();
    },
    getHotelCache:function (hotelId)
    {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data.data.find(obj => {
            return obj.hotelId === hotelId;
        })
    },
    getRoomCache:function (hotelId, roomId) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data.data.find(obj => {
            if (obj.hotelId.toString() === hotelId) {
             return  obj.rooms.find(room => {
                  return room.roomId === roomId;
              })
            }
        })

    },
        getCancelCache:function(hotelId) {
        var db = new JSONdb('./data.json');
        var data = db.JSON()
        return data.data.find(obj => {
             if(obj.hotelId.toString() === hotelId) return obj.cancellationPolicy;
        })
    }
}
