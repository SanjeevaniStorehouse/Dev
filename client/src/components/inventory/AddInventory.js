import { Link, withRouter } from "react-router-dom";
import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createInventory } from "../../actions/inventory";

const CreateInventory = ({ createInventory, history }) => {
  const [formData, setFormData] = useState({
    itemname: "",
    description: "",
    quantity: "",
    appovermatrix: "",
  });

  //const [displayContactInfo, toggleContactInfo] = useState(false);

  const { itemname, description, quantity, appovermatrix } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createInventory(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add Inventory</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Fill in the Form
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Pen"
            name="itemname"
            value={itemname}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Type a Unique Item Name</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Tool the helps with writing"
            name="description"
            value={description}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">
            Describe the item as accurately as you can.
          </small>
        </div>

        <div className="form-group">
          <select
            type="text"
            placeholder="User"
            name="appovermatrix"
            value={appovermatrix}
            onChange={(e) => onChange(e)}
            required
          >
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
          <small className="form-text">
            Please Select the proper approval level
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="10"
            name="quantity"
            value={quantity}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Please specify the quantity.</small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateInventory.propTypes = {
  createInventory: PropTypes.func.isRequired,
};

export default connect(null, { createInventory })(withRouter(CreateInventory));
