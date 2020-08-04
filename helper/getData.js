module.exports = function(data){
    //var moment = require('moment')
    //var fd = moment(data).format('DD/MM/YYYY');
    var d = new Date(data);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    d.setHours(0);
    d.setMinutes(0);
    d.setMilliseconds(0);
    d.setSeconds(0);
    return d;
}