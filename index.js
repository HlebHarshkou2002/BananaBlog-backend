import express from "express";
import fs from 'fs';
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

//Validators
import { registerValidator } from './validators/auth.js';
import { loginValidator } from "./validators/login.js";
import { postCreateValidation } from "./validators/post.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";


//Controllers
import { UserController, PostController } from './constrollers/index.js';

mongoose.connect(
    process.env.MONGODB_URI
).then(() => {
    console.log("DB ok")
}).catch((err) => {
    console.log("DB error", err)
})

const app = express();

//Хранилище для картинок
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})

//Функция для загрузки
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
//Роут для того, чтобы при запросе на картинку пользователь мог её посмотреть
app.use('/uploads', express.static('uploads')); // express.static означает что мы делаем get запрос на получение статичного файла

//Auth
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)


//Роут для обработки загрузки картинки
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

//Tags
app.get('/tags', PostController.getLastTags)

//Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
})