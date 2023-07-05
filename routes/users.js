const User = require("../models/User");
const router = require("express").Router();

// CRUD
// ユーザー情報の更新
// :id -> 任意のIDを示す
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                // $->Schemaのパラメーター全指定
                $set: req.body,
            });
            res.status(200).json("ユーザー情報が更新されました");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("アカウントIDが異なるのでユーザー情報を更新できません");
    }
});

// ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("ユーザー情報が削除されました");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("アカウントIDが異なるのでユーザー情報を削除できません");
    }
});

// ユーザー情報の取得
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updateAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch(err) {
        return res.status(500).json(err);
    }
});

module.exports = router;