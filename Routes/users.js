const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        God: "Proverbs 5:6"
    })
}
);

// lh:5500/api/users/usertest

module.exports = router;