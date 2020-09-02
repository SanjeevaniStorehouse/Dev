import { Link, withRouter } from "react-router-dom";
import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createRequest } from "../../actions/request";

const CreateRequest = ({ createRequest, history }) => {
  const [formData, setFormData] = useState({
    requesteditem: "",
    requesttype: "Submit",
    comments: "",
    quantity: "",
  });

  //const [displayContactInfo, toggleContactInfo] = useState(false);

  const { requesteditem, requesttype, comments, quantity } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createRequest(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Create A Request</h1>
      <p className="lead">
        <i className="fas fa-cart-arrow-down"></i> Let's get some information
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="House"
            name="requesteditem"
            value={requesteditem}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">
            {" "}
            Please type in item you want to Submit or Retrieve
          </small>
        </div>
        <div className="form-group">
          <select
            type="text"
            placeholder="Submit"
            name="requesttype"
            value={requesttype}
            onChange={(e) => onChange(e)}
            required
          >
            <option value="Submit">Submit</option>
            <option value="Retrieve">Retrieve</option>
          </select>
          <small className="form-text">
            Deposit or withdraw items from the store?
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Default item comment"
            name="comments"
            value={comments}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Please do include a reason why</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="10"
            name="quantity"
            value={quantity}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Specify the quantity!</small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateRequest.propTypes = {
  createRequest: PropTypes.func.isRequired,
};

export default connect(null, { createRequest })(withRouter(CreateRequest));
