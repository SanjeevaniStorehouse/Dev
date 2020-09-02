const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
//const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Requests = require("../../models/Requests");
const Inventory = require("../../models/Inventory");

//@route Get api/inventory
//@desc Get all Inventory
//@access Only admin
router.get("/", auth, async (req, res) => {
  var priviledge = req.user.useraccess;
  if (priviledge === "Admin") {
    try {
      const inventorys = await Inventory.find().populate();
      res.json(inventorys);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Not Authorised");
  }
});

//@route Get api/inventory/items
//@desc Get all items
//@access public
router.get("/items", auth, async (req, res) => {
  try {
    const inventorys = await Inventory.find(
      {},
      { itemname: 1, _id: 0 }
    ).populate();
    res.json(inventorys);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/inventory/:itemname
//@desc Search Inventory
//@access Admin/Approver only
router.get("/:itemname", auth, async (req, res) => {
  var priviledge = req.user.useraccess;
  if (priviledge !== "User") {
    try {
      const inventory = await Inventory.findOne({
        itemname: req.params.itemname,
      }); //req.params.itemname);
      if (!inventory) {
        res.status(404).json({ msg: "Item was Not Found!!" });
      }
      res.json(inventory);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        res.status(404).json({ msg: "Item Not Found!!" });
      }
      res.status(500).send("Server Error");
    }
  } else {
    res.status(500).send("Not Authorized");
  }
});

//@route POST api/inventory
//@desc Create/ Update inventory
//@access admin and approver only

router.post(
  "/",
  [
    auth,
    [
      check("itemname", "Item Name is necessary").not().isEmpty(),
      check("appovermatrix", "Specify the Approval Level please")
        .not()
        .isEmpty(),
      check("quantity", "Cannot add empty inventory").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var priviledge = req.user.useraccess;
    if (priviledge !== "User") {
      // scrape data from body
      const user = await await User.findById(req.user.id).select("-password");
      const { itemname, description, appovermatrix, quantity } = req.body;
      // build profile object
      const inventoryFields = {};
      inventoryFields.user = req.user.id;
      inventoryFields.name = user.name;
      if (itemname) inventoryFields.itemname = itemname;
      if (description) inventoryFields.description = description;
      //if (appovermatrix) inventryFields.appovermatrix = appovermatrix;
      if (quantity) inventoryFields.quantity = quantity;
      if (appovermatrix) inventoryFields.appovermatrix = appovermatrix;
      //
      try {
        let inventory = await Inventory.findOne({ itemname: itemname });
        //console.log(inventry);
        // If there is a Inventory then update Inventory

        if (inventory) {
          console.log(itemname);
          inventory = await Inventory.findOneAndUpdate(
            { itemname: itemname },
            { $set: inventoryFields },
            { new: true }
          );
          return res.json(inventory);
        }
        // Create inventory
        inventory = new Inventory(inventoryFields);
        await inventory.save();
        return res.json(inventory);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    } else {
      res.status(500).send("Not Authorised");
    }
  }
);

//@route POST api/inventory/approve/:id"
//@desc Update inventory based on approval
//@access admin and appropriate approver only

router.put("/approve/:id", [auth, []], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var priviledge = req.user.useraccess;
  if (priviledge === "Admin" || "1" || "2" || "3" || "4" || "5") {
    // scrape data from body
    const user = await User.findById(req.user.id).select("-password");
    let request = await Requests.findById(req.params.id);
    if (!request) {
      res.status(404).json({ msg: "Request Not Found!!" });
    }
    //console.log(request.quantity);
    const itemname = request.requesteditem;
    const appovermatrix = request.appovermatrix;
    const quantity = request.quantity;
    const requesttype = request.requesttype;
    const status = request.Status;

    // build profile object
    const inventoryFields = {};
    inventoryFields.user = req.user.id;
    inventoryFields.name = user.name;
    //if (itemname) inventoryFields.itemname = itemname;
    //if (quantity) inventoryFields.quantity = request.quantity;
    //if (appovermatrix) inventoryFields.appovermatrix = appovermatrix;

    //console.log(inventoryFields);
    //console.log(priviledge, appovermatrix);

    if (status === "Submitted") {
      if (priviledge === "Admin" || priviledge >= appovermatrix) {
        try {
          let inventory = await Inventory.findOne({ itemname: itemname });
          if (!inventory) {
            res.status(500).send("No Item Found");
          } else {
            var quanityleft = inventory.quantity;
            //console.log(quanityleft);
            if (requesttype === "Retrieve") {
              if (quantity <= quanityleft) {
                var newquantity = quanityleft - quantity;
                //console.log(newquantity);
                if (quantity) inventoryFields.quantity = newquantity;
                //console.log(itemname);
                inventory = await Inventory.findOneAndUpdate(
                  { itemname: itemname },
                  { $set: inventoryFields },
                  { new: true }
                );

                const requestFields = {};
                requestFields.Status = "Approved";
                requestFields.approvedby = user.name;
                let request = await Requests.findOneAndUpdate(
                  { _id: req.params.id },
                  { $set: requestFields },
                  { new: true }
                );

                return res.json(inventory);
                // Update the request as approved
              } else {
                res
                  .status(500)
                  .send("Can't be approved due to insufficient quantity");
              }
            } else {
              var newquantity = parseInt(quanityleft) + parseInt(quantity);
              //console.log(newquantity);
              //console.log(itemname);
              if (quantity) inventoryFields.quantity = newquantity;
              inventory = await Inventory.findOneAndUpdate(
                { itemname: itemname },
                { $set: inventoryFields },
                { new: true }
              );
              const requestFields = {};
              requestFields.Status = "Approved";
              requestFields.approvedby = user.name;
              let request = await Requests.findOneAndUpdate(
                { _id: req.params.id },
                { $set: requestFields },
                { new: true }
              );
              return res.json(request);
            }
          }
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      } else {
        res.status(500).send("Not Authoried");
      }
    } else {
      res.status(500).send("Request has already been handled");
    }
  } else {
    res.status(500).send("Not Authorized");
  }
});

//@route POST api/inventory/decline/:id"
//@desc update request based on denial
//@access admin and appropriate approver only

router.put("/decline/:id", [auth, []], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var priviledge = req.user.useraccess;
  if (priviledge === "Admin" || "1" || "2" || "3" || "4" || "5") {
    // scrape data from body
    const user = await User.findById(req.user.id).select("-password");
    let request = await Requests.findById(req.params.id);
    if (!request) {
      res.status(404).json({ msg: "Request Not Found!!" });
    }
    //console.log(request.quantity);
    const itemname = request.requesteditem;
    const appovermatrix = request.appovermatrix;
    const quantity = request.quantity;
    const requesttype = request.requesttype;
    const status = request.Status;

    const inventoryFields = {};
    inventoryFields.user = req.user.id;
    inventoryFields.name = user.name;

    if (status === "Submitted") {
      if (priviledge === "Admin" || priviledge >= appovermatrix) {
        try {
          let inventory = await Inventory.findOne({ itemname: itemname });
          if (!inventory) {
            res.status(500).send("No Item Found");
          } else {
            const requestFields = {};
            requestFields.Status = "Declined";
            requestFields.approvedby = user.name;
            let request = await Requests.findOneAndUpdate(
              { _id: req.params.id },
              { $set: requestFields },
              { new: true }
            );
            return res.json(request);
          }
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      } else {
        res.status(500).send("Not Authoried");
      }
    } else {
      res.status(500).send("Request has already been handled");
    }
  } else {
    res.status(500).send("Not Authorized");
  }
});

module.exports = router;
