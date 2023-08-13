const router = require("express").Router();
const { json } = require("express");
const Post = require("../models/Post");
const { route } = require("./posts");

// 投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// 投稿を更新する
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿の編集に成功しました");
        } else {
            return res.status(403).json("他の人の投稿を編集することはできません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

// 投稿を削除する
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("投稿の削除に成功しました");
        } else {
            return res.status(403).json("他の人の投稿を削除することはできません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

// 特定の投稿を取得する
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(403).json(err);
    }
});

// 特定の投稿にいいねを押す
router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // いいねを押したユーザーが既に投稿にいいねを押しているか確認
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json("投稿にいいね!しました");
        // 投稿に既にいいねを押している場合、いいねを取り消す
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                }
            });
            return res.status(200).json("いいね！をはずしました");
        }
    }
     catch (err) {
        return res.status(403).json(err)
    } 
})

module.exports = router;