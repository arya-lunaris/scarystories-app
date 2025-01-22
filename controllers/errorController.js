import express from 'express';

const router = express.Router();

router.route('/loginError').get(function (req, res) {
    res.render('errors/loginError.ejs');
});

router.route('/deleteStoryError').get(function (req, res) {
    res.render('errors/deleteStoryError.ejs');
});

router.route('/updateStoryError').get(function (req, res) {
    res.render('errors/updateStoryError.ejs');
});

router.route('/storyNotFound').get(function (req, res) {
    res.render('errors/storyNotFound.ejs');
});

router.route('/userNotFound').get(function (req, res) {
    res.render('errors/userNotFound.ejs');
});

router.route('/incorrectPassword').get(function (req, res) {
    res.render('errors/incorrectPassword.ejs');
});

router.route('/passwordsNotMatch').get(function (req, res) {
    res.render('errors/passwordsNotMatch.ejs');
});

router.route('/invalidPassword').get(function (req, res) {
    res.render('errors/invalidPassword.ejs');
});

router.route('/usernameError').get(function (req, res) {
    res.render('errors/usernameError.ejs');
});

router.route('/emailError').get(function (req, res) {
    res.render('errors/emailError.ejs');
});

export default router;