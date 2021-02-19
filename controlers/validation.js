var regex = new RegExp(/^[a-zA-Z ]+$/);

// const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
var adminRegex = new RegExp(/^([^@\s]+)@((admin\.)+com)$/);
// return re.test(String(email).toLowerCase());
exports.controler = {
    username: function (name) {
        var ret = regex.test(name);
        return ret;

    },
    email: function (email) {
        var ret = emailRegex.test(email);
        return ret;
    },
    password: function (pass) {
        var ret = pass.length >= 8 ? true : false;
        return ret;
    },
    admin: function (email) {
        var ret = adminRegex.test(email);
        return ret;

    }
}