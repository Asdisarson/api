module.exports = {
    checkCache:function (time){
        const date1 = new Date();
        const date2 = new Date(time);

        return date1.getTime() > date2.getTime();
    },
    setTimeOut: function (numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

        return date;
    }
}
