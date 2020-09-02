import { Link, withRouter } from "react-router-dom";
import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { changePassword } from "../../actions/auth";

const ChangePassword = ({ setAlert, changePassword, history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newpassword: "",
    newpassword2: "",
  });

  //const [displayContactInfo, toggleContactInfo] = useState(false);

  const { email, password, newpassword, newpassword2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (newpassword !== newpassword2) {
      setAlert("Password Mismatch", "danger");
    } else {
      //console.log(formData);
      //register({ name, email, useraccess, password });
      changePassword(formData, history);
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Change Password</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Fill in the new password
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="abc@infosys.com"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Type in your email</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Old Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="8"
            required
          />
          <small className="form-text">Enter your old Password</small>
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            name="newpassword"
            value={newpassword}
            onChange={(e) => onChange(e)}
            minLength="8"
            required
          />
          <small className="form-text">Please enter a strong password</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="newpassword2"
            value={newpassword2}
            onChange={(e) => onChange(e)}
            minLength="8"
            required
          />
          <small className="form-text">Please confirm your new password</small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, changePassword })(
  withRouter(ChangePassword)
);
