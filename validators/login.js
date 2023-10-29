import { body } from "express-validator";

export const loginValidator = [
    body('email', "Неверный формат почты").isEmail(),
    body('password', 'Длина пароля должна быть больше 5 символов').isLength({min: 5}),
]