const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();
const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para autenticação
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro na validação dos dados
 */
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Usuário ou senha incorretos
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// Rota protegida
router.get('/protected', authenticateToken, (req, res) => {
    if (req.user.role === 'user') {
        res.json({ message: 'Acesso autorizado para administrador.' });
    } else {
        res.json({ message: 'Acesso autorizado.' });
    }
});

// Função de middleware para autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido.' });
        req.user = user;
        next();
    });
}

// Rota para solicitar redefinição de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const resetToken = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Redefinição de Senha',
            html: `<p>Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
                   <p><a href="${resetUrl}">Redefinir Senha</a></p>`
        });

        res.json({ message: 'E-mail de redefinição de senha enviado.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao solicitar redefinição de senha.' });
    }
});

// Rota para redefinir senha
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({ where: { id: decoded.id, resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } });

        if (!user) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao redefinir senha.' });
    }
});

module.exports = router;
