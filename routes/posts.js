const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("post router");
});

module.exports = router;