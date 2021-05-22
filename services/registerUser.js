const userModel = require('../models/user.model')
module.exports.register = async (req, res) => {
    const isExist = await userModel.countUsers(req.body.username)
    if (isExist > 0) {
        req.flash('error_msg', `${req.body.username} is exist try another one`);
        res.redirect('/register');
    } else if (req.body.password !== req.body.cPassword) {
        req.flash('error_msg', 'passwords not match');
        res.redirect('/register');
    } else {
        userModel.create({username: req.body.username, password: req.body.password})
        req.flash('success_msg', 'you registered successfully login for using MeChat');
        res.redirect('/');
    }
}