import {body} from 'express-validator';

export const registerValidator = [
    body('email', "Неверный формат почты").isEmail(),
    body('password', 'Длина пароля должна быть больше 5 символов').isLength({min: 5}),
    body('fullName', 'Длина имени не может быть меньше 3 символов').isLength({min: 3}),
    body('avatarUrl', 'Ссылка не верна').optional().isURL(),
]