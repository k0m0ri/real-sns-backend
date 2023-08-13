const User = require("../models/User");
const router = require("express").Router();

// CRUD
// ユーザー情報の更新
// :id -> 任意のIDを示す
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                // $: Schemaのパラメーター全指定
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

// ユーザーのフォロー
router.put("/:id/follow", async(req, res) => {
    // 自分自身のIDとフォロー対象のユーザーのIDが等しくない
    if(req.body.userId !== req.params.id) {
        try {
            const follower = await User.findById(req.params.id);
            const you = await User.findById(req.body.userId);

            // これからフォローする人のフォローワーに自身が含まれていない場合、フォロー可能
            if(!follower.followers.includes(req.body.userId)) {
                await follower.updateOne({
                    $push: {
                        followers: req.body.userId,
                    },
                });
                await you.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォローしました");
            } else {
                return res.status(403).json("フォロー済みのユーザーです");
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身はフォローすることができません");
    }
})

// ユーザーのアンフォロー
router.put("/:id/unfollow", async(req, res) => {
    // 自分自身のIDとフォロー解除対象のユーザーのIDが等しくない
    if(req.body.userId !== req.params.id) {
        try {
            const unfollower = await User.findById(req.params.id);
            const you = await User.findById(req.body.userId);

            if(unfollower.followers.includes(req.body.userId)) {
                await unfollower.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    },
                });
                await you.updateOne({
                    $pull: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォロー解除しました");
            } else {
                return res.status(403).json("フォローされていません");
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("自分自身のフォローを外すことはできません");
    }
})

module.exports = router;