var sess;
exports.controler = {
    logout: function (req, res) {
        console.log("Before -> ");
        console.log("Start session -> ");
        console.log(req.session)
        console.log("end session -> ");

        req.session.destroy();
        console.log("After -> ");
        console.log("Start session -> ");
        console.log(req.session)
        console.log("end session -> ");
        // res.send("<script>location.href= '/home.html'</script>")
        // }
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