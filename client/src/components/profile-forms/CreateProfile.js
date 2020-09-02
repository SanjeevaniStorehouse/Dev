import { Link, withRouter } from "react-router-dom";
import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {
  const [formData, setFormData] = useState({
    appovertype: "",
    location: "",
    status: "",
    bio: "",
    phoneone: "",
    phonetwo: "",
  });

  const [displayContactInfo, toggleContactInfo] = useState(false);

  const { appovertype, location, bio, phoneone, phonetwo } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <select
            type="text"
            placeholder="User"
            name="appovertype"
            value={appovertype}
            onChange={(e) => onChange(e)}
            required
            disabled
          >
            <option value="User">User</option>
            <option value="1">Approver L1</option>
            <option value="2">Approver L2</option>
            <option value="3">Approver L3</option>
            <option value="4">Approver L4</option>
            <option value="5">Approver L5</option>
            <option value="Admin">Admin</option>
          </select>
          <small className="form-text">
            Please Select the proper approval level
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="City"
            name="location"
            value={location}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">Which city do you work in?</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Im a Approver Part of X DU TVM"
            name="bio"
            value={bio}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">
            Please let us know who you are? and what you do?
          </small>
        </div>

        <div className="my-2">
          <button
            onClick={() => toggleContactInfo(!displayContactInfo)}
            type="button"
            className="btn btn-light"
          >
            Add Contact Info
          </button>
          <span>Optional</span>
        </div>
        {displayContactInfo && (
          <Fragment>
            <div className="form-group social-input">
              <input
                type="text"
                placeholder="Primary Phone"
                name="phoneone"
                value={phoneone}
                onChange={(e) => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <input
                type="text"
                placeholder="Secondary Phone"
                name="phonetwo"
                value={phonetwo}
                onChange={(e) => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
};

export default connect(null, { createProfile })(withRouter(CreateProfile));
