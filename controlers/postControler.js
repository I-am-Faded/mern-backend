import postModel from "../models/post.js";
import userModel from "../models/user.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await postModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags);
    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};

export const getLastComments = async (req, res) => {
    try {
        const posts = await postModel.find().limit(5).sort([['viewsCount', -1]]).populate('user').exec();

        const comments = posts.map(obj => obj.comments).flat().slice(0, 6);

        res.json(comments);
    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};


////
export const getTag = async (req, res) => {
    try {
        const tag = req.params.tag;
        const posts = await postModel.find({tags: tag}).populate('user').exec();

        res.json(posts);
    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};



export const getAll = async (req, res) => {
    try {
        const posts = await postModel.find().sort([['createdAt', -1]]).populate('user').exec();

        res.json(posts);
    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};

// populate
export const getPopulate = async (req, res) => {
    try {
        const posts = await postModel.find().sort([['viewsCount', -1]]).populate('user').exec();

        res.json(posts);
    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};

export const getOne= async (req, res) => {
   
    try {
        const postId = req.params.id;
       
        postModel.findOneAndUpdate({
            _id: postId,
        },{

            $inc: {viewsCount: 1},
        },{
            returnDocument: 'after',
        },
        (err, doc) => {
            if (err){
                console.log(err);
                return res.status(500).json({
                message: 'Не удалось вернуть статью'})
            }

            if(!doc) {
                return res.status(404).json({
                    message: 'статья не найдена'
                });

            }
            
            res.json(doc);

        }).populate('user');

    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};

export const remove = async (req, res) => {
   
    try {
        const postId = req.params.id;

        postModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                message: 'Не удалось удалить статью'})
            }

            if (!doc) {
                res.status(404).json({
                message: 'Статья не найдена'})
            }

            res.json({
                success: true,
            })
        });
       

    } catch(err){
        console.log(err);
        res.status(500).json({
        message: 'Не удалось получить статьи'})
    }
};


export const create = async (req, res) => {
    try{
       const doc = new postModel({
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(','),
        imageUrl: req.body.imageUrl,
        user: req.userId,
       });

       const post = await doc.save();

       res.json(post);
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью'
        });
    }
};

export const update = async (req, res) => {
    try{
       const postId = req.params.id;

       await postModel.updateOne({
        _id: postId,
       },{
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
       });

       res.json({
        success:true
       });
    } catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
};
/////
export const addComment = async (req, res) => {
    try{

        const user = await userModel.findById(req.userId);

        const posts = await postModel.findOneAndUpdate({_id: req.params.id},{$push: {comments:{text: req.body.text, user: user }}});

        // user:{ fullName: user.fullName, avatarUrl: user.avatarURL }

        res.json({
            posts
           });

     } catch(err) {
         console.log(err)
         res.status(500).json({
             message: 'Не удалось создать комментарий'
         });
     }
};
