var fs = require("fs");
var validation = require("./validation");
var isFoundBefore = false;
var isMatch = true;
var errorFlag = false;
//------------------------

// var cookieParser = require('cookie-parser');
// var session = require('express-session');
//-----------------------------------------------
//-----------------------------------------------
// app.use(cookieParser());
// app.use(session({secret: "Shh, its a secret!"}));
//-----------------------------------------------

var errors = {
    userNameErrorMessage: "",
    emailErrorMessage: "",
    passwordErrorMessage: "",
    passwordConfirmationErrorMessage: "",
    generalErrorMessage: ""
}
exports.controler = {
    register: function (req, res) {
        console.log("req.body -> " + req.body.password);

        var validName = validation.controler.username(req.body.name);
        var validEmail = validation.controler.email(req.body.email);
        var validPassword = validation.controler.password(req.body.password);
        var validPasswordConfirmation = validation.controler.password(req.body.password_confirmation);
        if (validName && validEmail && validPassword && validPasswordConfirmation) {
            var userIndex = users.findIndex((item) => item.email == req.body.email);
            if (userIndex >= 0) {
                console.log("This email registered before, please try with another email");
                isFoundBefore = true;
                errorFlag = true;
            } else {
                if ((req.body.password) != (req.body.password_confirmation)) {
                    console.log('Password Does not match, please try again');
                    isMatch = false;
                    errorFlag = true;
                } else {
                    console.log('ok');
                    var newqq = {};
                    var id;
                    if (users.length == 0) {
                        id = 1;
                    } else {
                        id = Number(users[users.length - 1].userID) + 1;
                    }

                    Object.assign(newqq, {
                        userID: `${id}`
                    }, req.body);
                    users.push(newqq);
                    saveUsersArrayToFile();
                    res.send("<script>location.href= '/login.html'</script>")


                }

            }
        } else {
            errorFlag = true;
        }
        if(errorFlag){
            console.log('validName ' + validName)
            console.log('validEmail ' + validEmail)
            console.log('validPassword ' + validPassword)
            console.log('validPasswordConfirmation ' + validPasswordConfirmation)
            console.log('isFoundBefore ' + isFoundBefore)
            console.log('isMatch ' + isMatch)
            validName ? errors['userNameErrorMessage'] = "" : errors['userNameErrorMessage'] = '* Name is not valid';
            validEmail ? errors['emailErrorMessage'] = "" : errors['emailErrorMessage'] = '* Email is not valid';
            validPassword ? errors['passwordErrorMessage'] = "" : errors['passwordErrorMessage'] = "* Password must be more than 8 digits";
            validPasswordConfirmation ? errors['passwordConfirmationErrorMessage'] = "" : errors['passwordConfirmationErrorMessage'] = "* Password Confirmation must be more than 8 digits";
            isFoundBefore ? errors['generalErrorMessage'] = '* This email registered before, please try with another email' : errors['generalErrorMessage'] = "";
            // isMatch ?  errors['generalErrorMessage'] ="" : errors['generalErrorMessage'] = '* Password Does not match, please try again';
            res.render("auth/register.ejs", {
                ...errors
            })
        }
        


    },
    login: function (req, res) {
        // res.send("ok")
        // console.log(req.body)
        let user = users.find(q => q.email == req.body.email && q.password == req.body.password);
        var userIndex = users.findIndex((item) => item.email == req.body.email);
        if (user) {

            var sessiondId = `${users[userIndex].userID}${users[userIndex].name}`;
            req.session.name = sessiondId;
            console.log("sessiondId = " + sessiondId)
            if (req.session.sessiondId) {
                req.session.sessiondId++;

            } else {
                req.session.sessiondId = 1;

            }
             res.send("<script>location.href= 'products/productList.html'</script>")
            // res.render("products/productList.ejs", {
            //     login: "ok",
            //     reload: true
            // });

            //generate session id ( random string or number)
            //add cookie with session id
            //user.sessiondId= 

        } else {
            res.render("auth/login.ejs", {
                errormessage: "email or password not correct"
            })
        }
    },
    loginView: function (req, res) {
        if (req.session.name) {
            // res.render("products/productList.ejs", {
            //     login: "ok",
            //     reload: true
            // });    
            res.send("<script>location.href= 'products/productList.html'</script>")

        } else {
            res.render("auth/login.ejs", {
                errormessage: ""
            })
        }

    },

    registerView: function (req, res) {
        res.render("auth/register.ejs", {
            ...errors
        })
    }
}


var users = [];
if (fs.existsSync("db/users.json")) {
    fs.readFile("db/users.json", function (err, data) {
        users = JSON.parse(data);
    })
}

function saveUsersArrayToFile() {
    fs.writeFile("db/users.json", JSON.stringify(users), function (err) {
        if (err)
            console.log(err)
    })
}