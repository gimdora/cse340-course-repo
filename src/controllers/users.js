import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!name || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/register');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);

        if (error.code === '23505') {
            req.flash('error', 'That email is already registered.');
        } else {
            req.flash('error', 'An error occurred during registration. Please try again.');
        }

        return res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
        req.flash('error', 'Email and password are required.');
        return res.redirect('/login');
    }

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Login successful!');

        if (res.locals.NODE_ENV === 'development') {
            console.log('User logged in:', user);
        }

        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.regenerate((error) => {
        if (error) {
            console.error('Error during logout:', error);
            req.flash('error', 'An error occurred during logout.');
            return res.redirect('/dashboard');
        }

        req.flash('success', 'Logout successful!');
        return res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.session?.user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== roleName) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        user
    });
};

const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Users',
            users
        });
    } catch (error) {
        next(error);
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};