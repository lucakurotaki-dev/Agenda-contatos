const Login = require('../models/LoginModel')

exports.index = (req, res) => {
  res.render('login');
};  

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    //exibe erros com flash message
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('back');
      });
      return;
    }
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('back');
      });
      return;
    }
    req.flash('success', 'Your account has been created successfuly!');
    req.session.save(function () {
      return res.redirect('back');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/');
}