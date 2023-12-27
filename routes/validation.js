const cookieParser = require("cookie-parser");

exports.validation = async(req,res,next) => {

        const cookies = req.cookies;

        if (!cookies) {
            return res.redirect('/Login')
        } else {
          next();
        }

}
