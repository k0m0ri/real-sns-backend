const User = require("../models/User");
const router = require("express").Router();

// ユーザー登録
// パスワードを平文で受けて平文で保存しているのでハッシュ化をして
// 堅牢性をあげる必要がある
router.post("/register", async (req, res) => {
    try {
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch(err) {
        return res.status(500).json(err);
    }
});

// ログイン機能
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("ユーザーが見つかりません");
        
        const vailedPassword = req.body.password === user.password;
        if(!vailedPassword) return res.status(400).json("パスワードが違います");

        return res.status(200).json(user);
    } catch(err) {
        return res.status(500).json(err);
    }
})

module.exports = router;