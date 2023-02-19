import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userModel from '../models/user.js';

export const register = async (req, res) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarURL: req.body.avatarURL,
      passwordHash: Hash,
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
    }, 'secret12345', {
        expiresIn: '30d'
    });

    const {passwordHash, ...userData} = user._doc;
    
    res.json({
        ...userData,
        token
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'не удалось зарегистрироваться'
    });
  }
};

export const login = async (req, res) => {
    try {
     const user = await userModel.findOne({email: req.body.email});
 
     if(!user){
         return res.status(404).json({
             message: 'Пользователь не найден'
         });
     }
 
     const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
     if(!isValidPassword){
         return res.status(400).json({
           message: 'Неверный логин или Пароль'
         });
     }
 
     const token = jwt.sign({
         _id: user._id,
     }, 'secret12345', {
         expiresIn: '30d'
     });
 
 
     const {passwordHash, ...userData} = user._doc;
     
     res.json({
         ...userData,
         token
     });
 
    } catch (err) {
      console.log(err);
     res.status(500).json({
         message: 'не удалось Авторизоваться'
     });}
};

export const getMe =  async (req, res) => {
    try{ 
        const user = await userModel.findById(req.userId);

        if(!user){
            res.status(404).json({
                message: 'ПОльзователь не найден'
            });
        }
        const {passwordHash, ...userData} = user._doc;
    
        res.json({
            ...userData,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'нет доступа'
        });

    }
};