const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        God: "Proverbs 5:6"
    })
}
);

router.post("/userposttest", (req, res) => {
    const username = req.body.username;
    res.send("your username is:" + username)
});
// lh:5500/api/users/usertest

module.exports = router;