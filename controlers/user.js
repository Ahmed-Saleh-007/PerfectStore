var fs = require("fs");
const multer = require('multer');
const path = require('path');
var config = require("../controlers/config");
var helpFunction = require("../controlers/help");

var users = [];
if (fs.existsSync("db/users.json")) {
    fs.readFile("db/users.json", function (err, data) {
        users = JSON.parse(data);
    })
}

//set storge engine
const storge = multer.diskStorage({
    destination: './public/upload/usersImges',
    filename: function (req, file, cb) {
        cb(null, `userID-${users.length == 0 ? 1 :Number(users[users.length - 1].userID) + 1}${Date.now()}-${file.originalname}`);
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
    viwe: function (req, res) {
        if (req.session.name) {
            let user = req.session.userID;
            var userIndex = users.findIndex((item) => item.userID == user);
            console.log(users[userIndex])
            if (user) {
                req.session.name = `${users[userIndex].userID}${users[userIndex].name}`;
                req.session.userID = users[userIndex].userID;
                res.render('../views/users/profile.ejs', {
                    msg: '',
                    err: -1,
                    login: req.session.name ? 'ok' : 'no',
                    userName: users[userIndex].name,
                    userEmail: users[userIndex].email,
                    pass: users[userIndex].password,
                    userID: users[userIndex].userID,
                    userImage: users[userIndex].imagename,
                    flag: false
                })
            } else {
                res.send({
                    error: "user not found"
                });

            }

        } else {
            res.send('<script> location.href = "/home.html" </script>');
        }

    },
    viewedit: (req, res) => {
        if (req.session.name) {
            let user = req.session.userID;
            var userIndex = users.findIndex((item) => item.userID == user);
            console.log(users[userIndex])
            if (user) {
                // req.session.destroy();
                res.render('../views/users/profile.ejs', {
                    msg: 'Data updated please sign in again with new data',
                    err: false,
                    // login: req.session.name ? 'ok' : 'no',
                    login:'no',
                    userName: users[userIndex].name,
                    userEmail: users[userIndex].email,
                    pass: users[userIndex].password,
                    userID: users[userIndex].userID,
                    userImage: users[userIndex].imagename,
                    flag: true
                })
            } else {
                res.send({
                    error: "user not found"
                });

            }

        } else {
            res.send('<script> location.href = "/home.html" </script>');
        }
    },
    delete: function (req, res) {
        var userIndex = productArray.findIndex((item) => item.userID == req.params.id);
        var imageName = '';
        if (userIndex >= 0) {
            imageName = users[userIndex].userImage;
            users.splice(userIndex, 1);

            saveProductArrayToFile();
            if (imageName !== "") {
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
        var userIndex = users.findIndex((item) => item.userID == req.params.id);

       
            upload(req, res, (error) => {
                if (error) {
                    res.render('../views/users/profile.ejs', {
                        msg: `Error: ${error.message}`,
                        login: req.session.name ? 'ok' : 'no',
                        userName: `${users[userIndex].name}`,
                        userEmail: users[userIndex].email,
                        pass: users[userIndex].password,
                        userID: users[userIndex].userID,
                        userImage: users[userIndex].imagename,
                        err: true,
                        flag:false
                    });
                } else {


                    if (config.controler.mode == 'devolopment') {
                        console.log(req.file);
                        console.log(req.body);
                    }

                    var imgName;
                    console.log("req.body -> ")
                    console.log(req.body)
                    if (req.file == undefined) {
                        imgName = users[userIndex].imagename;
                        users[userIndex].name = req.body.name;
                        users[userIndex].email = req.body.email;
                        users[userIndex].imagename = imgName;
                    } else {
                        try {
                            fs.unlinkSync(`public/upload/usersImges/${users[userIndex].imagename}`);

                        } catch (e) {
                            res.status(400).send({
                                message: "Error deleting image!",
                                error: e.toString(),
                                req: req.body
                            });
                        }
                        imgName = `${req.file.filename}`
                        users[userIndex].name = req.body.name;
                        users[userIndex].email = req.body.email;
                        users[userIndex].imagename = imgName;








                    }
                    saveUsersArrayToFile();
                    // res.render('../views/users/profile.ejs', {
                    //     msg: 'File Uploaded',
                    //     login: req.session.name ? 'ok' : 'no',
                    //     err: 0,
                    //     items: users,
                    //     userName: `${users[userIndex].name}`,
                    //     userEmail: users[userIndex].email,
                    //     pass: users[userIndex].password,
                    //     userID: users[userIndex].userID,
                    //     userImage: users[userIndex].imagename
                    // });

                    res.send("<script> location.href = '/users/user/viewedit.html'</script>")


                }

            });

    }
}



function saveUsersArrayToFile() {
    fs.writeFile("db/users.json", JSON.stringify(users), function (err) {
        if (err)
            console.log(err)
    })
}