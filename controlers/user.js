var fs = require("fs");
const multer = require('multer');
const path = require('path');
var config = require("../controlers/config");


exports.controler = {
    viwe: function (req,res) {
        let user = req.session.userID;
        var userIndex = users.findIndex((item) => item.userID == user);
        if (user) {
            // req.session.userName = users[userIndex].name;
            // req.session.userEmail = users[userIndex].email;
            // req.session.userPass = users[userIndex].password;  
            res.render('../views/users/profile.ejs', {
                msg: '',
                err: -1,
                login: req.session.name?'ok':'no',
                userName: `${users[userIndex].name}`,
                userEmail:users[userIndex].email,
                pass: users[userIndex].password
            })
        } else {
            res.send({
                error: "user not found"
            });
            
        }
       
    },
    delete: function (req,res) {
        var userIndex = productArray.findIndex((item) => item.userID == req.params.id);
        var imageName = '';
        if (userIndex >= 0) {
            imageName = users[userIndex].userImage;
            users.splice(userIndex, 1);

            saveProductArrayToFile();
            if(imageName !== ""){
                try {
                    fs.unlinkSync(`public/upload/${imageName}`);
    
    
    
                } catch (e) {
                    res.status(400).send({
                        message: "Error deleting image!",
                        error: e.toString(),
                        req: req.body
                    });
                }
            }
            
            res.send({
                success: "user deleted"
            });
        } else {
            res.send({
                error: "user not found"
            });
        }
    },
    edit: function (req,res) {

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