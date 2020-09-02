const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

//@route GET api/dashboard
//@desc test route
//@access Public
//console.log(profileFields.appovertype);
router.get("/", auth, async (req, res) => {
  console.log(req.user.useraccess);
  if ((req.user.useraccess = "admin")) {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      }).populate("user", ["name", "avatar"]);

      //if (!profile) {
      //return res.status(400).json({ msg: "User has no Profile saved" });
      //}
      //res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

module.exports = router;
