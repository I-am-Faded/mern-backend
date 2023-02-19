import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validators/validations.js';
import cors from 'cors';
import multer from 'multer';


import {handleValidationErrors, checkAuth } from './utils/index.js'

import {userControler, postControler} from './controlers/index.js';



mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('db OK'))
.catch((err) => console.log('db error', err)) ;

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads');
    },
    filename:  (_, file, cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, userControler.login );
app.post('/auth/register', registerValidation, handleValidationErrors, userControler.register);
app.get('/auth/me', checkAuth, userControler.getMe);


app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', postControler.getLastTags);
app.get('/tags/:tag', postControler.getTag);

app.post('/posts/:id', checkAuth, postControler.addComment);
// app.post('/comments', checkAuth, postControler.addComment);
app.get('/comments', postControler.getLastComments);
app.get('/posts/comments', postControler.getLastComments);



app.get('/posts', postControler.getAll);
app.get('/populate', postControler.getPopulate);

app.get('/posts/tags', postControler.getLastTags);
app.get('/posts/:id',  postControler.getOne);
app.post('/posts',checkAuth, postCreateValidation , handleValidationErrors, postControler.create);
app.delete('/posts/:id',checkAuth, postControler.remove);
app.patch('/posts/:id',checkAuth, postCreateValidation, handleValidationErrors, postControler.update);

app.listen(4444, (err) =>{
    if(err){
        return console.log(err);
    }

    console.log('server ok');
})