const JSONdb = require("simple-json-db");

module.exports = {
    checkCache:function (time){
        const date1 = new Date();
        const date2 = new Date(time);

        return date1.getTime() > date2.getTime();
    },
    setTimeOut: function (numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

        return date;
    },
    cache:function () {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data;
    },
    getHotelCache:function (hotelId)
    {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data.data.filter(obj => {
            return obj.hotelId === hotelId;
        })
    },
    getRoomCache:function (hotelId, roomId) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data.data.find(obj => {
            if (obj.hotelId === hotelId) {
                return  obj.rooms.find(room => {
                    return room.roomId === roomId;
                })
            }
        })

    },
    getCancelCache:function(hotelId) {
        var db = new JSONdb('./cache.json');
        var data = db.JSON()
        return data.data.filter(obj => {
            return obj.hotelId === hotelId;
        })
    }
}
