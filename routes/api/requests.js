const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const Requests = require("../../models/Requests");
const User = require("../../models/User");
const Inventory = require("../../models/Inventory");

//@route GET api/requests/myopen
//@desc get my open requests
//@access Private
router.get("/myopen", auth, async (req, res) => {
  try {
    const myrequests = await Requests.find({
      $and: [{ user: req.user.id }, { Status: "Submitted" }],
    }).sort({ date: -1 });

    if (!myrequests) {
      return res.status(400).json({ msg: "User Has no requests" });
    }
    res.json(myrequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/requests/log
//@desc get log of all requests
//@access Admiin
router.get("/log", auth, async (req, res) => {
  var priviledge = req.user.useraccess;
  if (priviledge === "Admin") {
    try {
      const myrequests = await Requests.find({
        Status: { $ne: "Submitted" },
      }).sort({ date: -1 });

      if (!myrequests) {
        return res.status(400).json({ msg: "The DB is Empty" });
      }
      res.json(myrequests);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Not Authorized");
  }
});

//@route GET api/requests/myclosed
//@desc get my closed requests
//@access Private
router.get("/myclosed", auth, async (req, res) => {
  try {
    const myrequests = await Requests.find({
      $and: [{ user: req.user.id }, { Status: "Approved" }],
    }).sort({ date: -1 });

    if (!myrequests) {
      return res.status(400).json({ msg: "User Has no requests" });
    }
    res.json(myrequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/requests
//@desc Add or retreive items
//@access Private
router.post(
  "/",
  [
    auth,
    [
      check("requesteditem", "Please enter the Item").not().isEmpty(),
      check("requesttype", "Specify the type of transaction").not().isEmpty(),
      check("quantity", "Please specify the quantity").not().isEmpty(),
      check("comments", "Please enter your comment").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await await User.findById(req.user.id).select("-password");
      var stat = "Submitted";
      let inventory = await Inventory.findOne({
        itemname: req.body.requesteditem,
      });
      if (!inventory) {
        return res.status(400).json({ msg: "Item Not found" });
      }
      var appovermatrix = inventory.appovermatrix;
      console.log(appovermatrix);
      const newRequest = new Requests({
        requesteditem: req.body.requesteditem,
        requesttype: req.body.requesttype,
        comments: req.body.comments,
        quantity: req.body.quantity,
        appovermatrix: appovermatrix,
        name: user.name,
        user: req.user.id,
        Status: stat,
      });
      const requests = await newRequest.save();
      res.json(requests);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route GET api/requests
//@desc Get all Requests
//@access Admin only
router.get("/", auth, async (req, res) => {
  var priviledge = req.user.useraccess;
  if (priviledge === "Admin") {
    try {
      const requestss = await Requests.find({ Status: "Submitted" }).sort({
        date: -1,
      });
      res.json(requestss);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else if (priviledge !== "User") {
    try {
      const requestss = await Requests.find({
        appovermatrix: { $lte: priviledge },
        Status: "Submitted",
      }).sort({ date: -1 });
      if (!requestss) {
        return res
          .status(400)
          .json({ msg: "There's no request pending approval" });
      }
      res.json(requestss);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else if (priviledge === "User") {
    try {
      const myrequests = await Requests.find({
        $and: [{ user: req.user.id }],
      }).sort({ date: -1 });

      if (!myrequests) {
        return res.status(400).json({ msg: "User Has no requests" });
      }
      res.json(myrequests);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Not Authorized");
  }
});

//@route GET api/requests/:id
//@desc Search Request
//@access Admin only
router.get("/:id", auth, async (req, res) => {
  var priviledge = req.user.useraccess;
  if (priviledge === "Admin") {
    try {
      const requests = await Requests.findById(req.params.id);
      if (!requests) {
        res.status(404).json({ msg: "Post Not Found!!" });
      }
      res.json(requests);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        res.status(404).json({ msg: "Post Not Found!!" });
      }
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Not Authorized");
  }
});

//@route DELETE api/requests/:id
//@desc Delete Request
//@access Admin only
router.delete("/:id", auth, async (req, res) => {
  //var priviledge = req.user.useraccess;
  //if (priviledge === "Admin") {
  try {
    const requests = await Requests.findById(req.params.id);
    if (!requests) {
      res.status(404).json({ msg: "Request Not Found!!" });
    }

    // check owner of request
    if (requests.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    // CHeck Request status
    if (requests.Status.toString() !== "Submitted") {
      return res.status(401).json({ msg: "Request already processed" });
    }

    await requests.remove();
    res.json({ msg: "Request Deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      res.status(404).json({ msg: "Request Not Found!!" });
    }
    res.status(500).send("Server Error");
  }
  //} else {
  //res.status(500).send("Not Authorized");
  //}
});

module.exports = router;
