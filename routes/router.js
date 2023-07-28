/**
 * Created by JK on 2016-08-30.
 */

module.exports = function(app)
{
    console.log("START Dudukri")

    app.get('/', function(req, res){

        console.log("START /")
        res.render('home.html');
    })
}