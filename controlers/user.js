var fs = require("fs");
const multer = require('multer');
const path = require('path');
var config = require("../controlers/config");
var helpFunction = require("../controlers/help");

//set storge engine
const storge = multer.diskStorage({
    destination: './public/upload',
    filename: function (req, file, cb) {
        cb(null, `${users.length == 0 ? 1 :Number(users[users.length - 1].userID) + 1}-${req.body.name}-${Date.now()}-${file.originalname}`);
    }
});

//init upload 
const upload = multer({
    storage: storge,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        // checkFileType(file, cb);
        helpFunction.controler.checkFileType(file, cb);
    }
}).single("image");


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
    edit: (req, res) => {
        if (req.session.is_Admin === 'true') {
            upload(req, res, (error) => {
                if (error) {
                    res.render('adminProductControl', {
                        msg: `Error: ${error.message}`,
                        login: req.session.name ? 'ok' : 'no',
                        items:[],
                        err: true
                    });
                } else {
                    if (req.file == undefined) {
                        res.render('adminProductControl', {
                            msg: 'Error: No File Selected',
                            login: req.session.name ? 'ok' : 'no',
                            items:[],
                            err: 1
                        });
                    } else {
                        if (config.controler.mode == 'devolopment') {
                            console.log(req.file);
                            console.log(req.body);
                        }
                        var newqq = {};
                        var id;
                        if (productArray.length == 0) {
                            id = 1;
                        } else {
                            id = Number(productArray[productArray.length - 1].productID) + 1;
                        }
                        if (config.controler.mode == 'devolopment') {
                            console.log('hi -> ' + req.file.filename);
                        }
                        Object.assign(newqq, {
                            productID: `${id}`
                        }, req.body, {
                            productImage: `${req.file.filename}`
                        });

                        // Object.assign(newqq, {
                        //     productImage: `${req.file.filename}`
                        // });

                        productArray.push(newqq);
                        saveProductArrayToFile();

                        if (config.controler.mode == 'devolopment') {
                            console.log(productArray.length)
                        }
                        let obj = {}
                        Object.assign(obj, {
                            page: 1,
                            imgprepage: productArray.length,
                            data: productArray
                        })

                        if (config.controler.mode == 'devolopment') {
                            console.log(obj.data[7])
                        }

                        res.render('adminProductControl', {
                            msg: 'File Uploaded',
                            login: req.session.name ? 'ok' : 'no',
                            err: 0,
                            items:productArray,
                            file: `upload/${req.file.originalname}`
                        });
                    }
                }
            });
        }else{
            res.send('<script> location.href = "/home.html" </script>');
        }

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