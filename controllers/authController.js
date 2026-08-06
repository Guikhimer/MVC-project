const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const wantsHtml = (req) => req.headers.accept?.includes('text/html');

const sendAuthResponse = (req, res, user, statusCode) => {
  const token = jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie('token', token, cookieOptions());

  if (wantsHtml(req)) {
    return res.redirect('/');
  }

  return res.status(statusCode).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
  });
};

const renderLogin = (req, res) => res.render('login', { page: 'login', error: null });
const renderRegister = (req, res) => res.render('register', { page: 'register', error: null });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      const message = 'Preencha nome, e-mail e uma senha com ao menos 8 caracteres.';
      return wantsHtml(req)
        ? res.status(400).render('register', { page: 'register', error: message })
        : res.status(400).json({ success: false, message });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.exists({ email: normalizedEmail });
    if (exists) {
      const message = 'Já existe uma conta cadastrada com este e-mail.';
      return wantsHtml(req)
        ? res.status(409).render('register', { page: 'register', error: message })
        : res.status(409).json({ success: false, message });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });
    return sendAuthResponse(req, res, user, 201);
  } catch (error) {
    const message = 'Não foi possível criar a conta. Tente novamente.';
    return wantsHtml(req)
      ? res.status(500).render('register', { page: 'register', error: message })
      : res.status(500).json({ success: false, message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() }).select('+password');
    const validPassword = user && await bcrypt.compare(password || '', user.password);

    if (!validPassword) {
      const message = 'E-mail ou senha inválidos.';
      return wantsHtml(req)
        ? res.status(401).render('login', { page: 'login', error: message })
        : res.status(401).json({ success: false, message });
    }

    return sendAuthResponse(req, res, user, 200);
  } catch {
    const message = 'Não foi possível entrar. Tente novamente.';
    return wantsHtml(req)
      ? res.status(500).render('login', { page: 'login', error: message })
      : res.status(500).json({ success: false, message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  if (wantsHtml(req)) return res.redirect('/');
  return res.status(200).json({ success: true, message: 'Sessão encerrada.' });
};

const me = (req, res) => res.status(200).json({ success: true, data: req.user });

module.exports = { renderLogin, renderRegister, register, login, logout, me };
