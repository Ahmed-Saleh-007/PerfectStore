var sess;
exports.controler = {
    logout: function (req, res) {
        
        req.session.destroy();
        
        res.send("<script>location.href= '/home.html'</script>")
        
        // res.render("../views/index.ejs", {

        //     msg: '',
        //     err: -1,
        //     login: req.session.name ? 'ok' : 'no'
        // })

    },
    homeView: function (req, res) {

        console.log("/home.html -> ");
        console.log("Start session -> ");
        console.log(req.session)
        console.log("end session -> ");


        res.render("../views/index.ejs", {

            msg: '',
            err: -1,
            login: req.session.name ? 'ok' : 'no'
        })

    }
}