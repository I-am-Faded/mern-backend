import {body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный Формат почты').isEmail(),
    body('password' ,'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    // body('fullName','укажите имя минимум 3 символа').isLength({min: 3}),
    body('avatarURL','неверная ссылка на аватарку').optional().isURL(),
];

export const registerValidation = [
    body('email', 'Неверный Формат почты').isEmail(),
    body('password' ,'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName','укажите имя минимум 3 символа').isLength({min: 3}),
    body('avatarURL','неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text' ,'Введите текст статьи').isLength({min: 3}).isString(),
    body('tags','Неверный формат тегов (укажите масив').optional().isString(),
    body('imageUrl','Неверная ссылка на изображение').optional().isString(),
];