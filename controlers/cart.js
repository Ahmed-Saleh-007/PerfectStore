var fs = require("fs");
const path = require('path');
var config = require("../controlers/config");
var helpFunction = require("../controlers/help");


exports.controler = {

    cartview:(req,res)=>{
        if(req.session.name){
            res.render("products/cart.ejs", {
                msg: '',
                err: -1,
                items: cartItems,
                login: req.session.name ? 'ok' : 'no'
            })
            // res.send(cartItems);
        }else{
            res.send('<script> location.href = "/home.html" </script>');

        }
        
    },
    add: (data) => {
        // if(req.session.name){
            cartItems.push(data);
            console.log(cartItems)
            saveCartItemsToFile();
        // }else{
        //     res.send('<script> location.href = "/home.html" </script>');
        // }

    },
    delete: (req, res) => {
        var productIndex = productArray.findIndex((item) => item.productID == req.params.id);
        var imageName = '';
        if (productIndex >= 0) {
            imageName = productArray[productIndex].productImage;
            productArray.splice(productIndex, 1);

            saveProductArrayToFile();
            try {
                fs.unlinkSync(`public/upload/${imageName}`);



            } catch (e) {
                res.status(400).send({
                    message: "Error deleting image!",
                    error: e.toString(),
                    req: req.body
                });
            }
            res.send({
                success: "product deleted"
            });
        } else {
            res.send({
                error: "product not found"
            });
        }
    }
}


var cartItems = [];
if (fs.existsSync("db/cart.json")) {
    fs.readFile("db/cart.json", function (err, data) {
        cartItems = JSON.parse(data);
    });
}

function saveCartItemsToFile() {
    fs.writeFile("db/cart.json", JSON.stringify(cartItems), function (err) {
        if (err) console.log(err);
    });
}