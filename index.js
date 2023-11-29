const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public/style', express.static(path.join(__dirname, 'public/style')));
app.use('/public/js', express.static(path.join(__dirname, 'public/js')));
app.use('/public/html', express.static(path.join(__dirname, 'public/html')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.get('/', async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.render('index', { users: allUsers });
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/read', async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.render('read', { users: allUsers });
});

app.get('/update/:id', async (req, res) => {
    console.log('Handling /update/:id');
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    res.render('update', { user });
});

app.delete('/users/delete/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
});

app.put('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, phone } = req.body;

    await prisma.user.update({
        where: { id: userId },
        data: { name, email, phone },
    });

    res.json({ message: 'User updated successfully' });
});

app.post('/users', upload.single('image'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const stringPhone = String(phone);
        console.log('Received phone:', stringPhone);

        if (typeof stringPhone !== 'string') {
            return res.status(400).json({ error: 'Phone must be a string' });
        }

        const truncatedPhone = stringPhone.substring(0, 10);
        const image = req.file ? `/img/${req.file.filename}` : null;

        await prisma.user.create({
            data: { name, email, phone: truncatedPhone, image },
        });

        res.redirect('/read');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(3000, () => {
    console.log('Listening on 3000');
});
