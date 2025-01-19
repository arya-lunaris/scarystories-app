import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.route('/signup').get(async function (req, res) {
    res.render('user/signup.ejs');
});

router.route('/signup').post(async function (req, res, next) {
    try {
        const { password, passwordConfirmation } = req.body;

        if (password !== passwordConfirmation) {
            return res.redirect('/error/passwordsNotMatch');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.redirect('/error/invalidPassword');

        }

        await User.create(req.body);

        res.redirect('/user/login');
    } catch (e) {
        next(e);
    }
});

router.route('/profile').get(async function (req, res) {
    if (!req.session.user) {
        return res.redirect('/user/login');
    }

    const user = await User.findById(req.session.user._id);

    if (!user) {
        return res.redirect('/error/userNotFound');
    }

    res.render('user/profile.ejs', { user });
});

router.route('/profile').post(async function (req, res, next) {
    try {
        if (!req.session.user) {
            return res.redirect('/user/login');
        }

        const { username, email, password, passwordConfirmation } = req.body;

        if (password !== passwordConfirmation) {
            return res.redirect('/error/passwordsNotMatch');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (password && !passwordRegex.test(password)) {
            return res.redirect('/error/invalidPassword');

        }

        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.redirect('/error/userNotFound');
        }

        if (username) {
            user.username = username;
        }
        
        if (email) {
            user.email = email;
        }

        if (password) {
            user.password = password;
        }

        await user.save();

        res.redirect('/user/profile');
    } catch (e) {
        next(e);
    }
});

router.route('/login').get(async function (req, res) {
    res.render('user/login.ejs');
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.redirect('/error/userNotFound');
        }

        const isPasswordValid = await user.isPasswordValid(req.body.password);

        if (!isPasswordValid) {
            return res.redirect('/error/incorrectPassword');
        }

        req.session.user = user;
        res.redirect('/home');
    } catch (e) {
        next(e);
    }
});

router.route("/logout").get(async function (req, res, next) {
    req.session.destroy();
    res.redirect("/home");
});

export default router;