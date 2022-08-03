const func = require("./search.js");
module.exports = {
    getData: function(roomId, propertyId,i,y) {

        var date= new Date();
        var newDate = new Date(date.setMonth(date.getMonth()+i));
        var secDate = new Date(date.setMonth(date.getMonth()+y));

        var params = {
            roomIds: roomId,
            propertyId: propertyId,
            numberOfRooms:1,
            numberOfExtraBeds:1,
            end: secDate.toISOString(),
            start: newDate.toISOString()

        }
        return params
    }
}
