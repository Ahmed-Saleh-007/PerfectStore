
exports.controler = {
    addproduct: function (req,res) {
        res.render("../views/adminindex.ejs",{
            err:-1
        })

    },
    adminView: function (req,res) {
        res.render("../views/adminindex.ejs",{
            err:-1
        })

    }
}