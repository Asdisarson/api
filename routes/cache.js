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
        return data.data.filter(obj => {
            return obj.hotelId.toString() === hotelId;
        })
    },
    getRoomCache:function (hotelId, roomId) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        var hotel = data.data.find(obj => {
            return obj.hotelId.toString() === hotelId;
        })
        return      hotel.rooms.find(obj => {
            return obj.roomId.toString() === roomId;
        })
    },
}
