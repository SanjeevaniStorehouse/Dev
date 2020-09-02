import { Link, withRouter } from "react-router-dom";
import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../actions/profile";
//import { set } from "mongoose";

const initialState = {
  appovertype: "",
  location: "",
  status: "",
  bio: "",
  phoneone: "",
  phonetwo: "",
};

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history,
}) => {
  const [formData, setFormData] = useState(initialState);

  const [displayContactInfo, toggleContactInfo] = useState(false);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(", ");
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const { appovertype, location, status, bio, phoneone, phonetwo } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Edit Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Add some changes to your profile
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="1"
            name="appovertype"
            value={appovertype}
            onChange={onChange}
            disabled
          />
          <small className="form-text">
            PLease reach out to the Admin to change your approval level
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="City"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">Which city do you work in?</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Im a Approver Part of X DU TVM"
            name="bio"
            value={bio}
            onChange={onChange}
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
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <input
                type="text"
                placeholder="Secondary Phone"
                name="phonetwo"
                value={phonetwo}
                onChange={onChange}
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

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  EditProfile
);
