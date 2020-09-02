import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { approveInventory, declineInventory } from "../../actions/inventory";
import { deleteRequest } from "../../actions/request";

const RequestItem = ({
  approveInventory,
  declineInventory,
  deleteRequest,
  auth,
  request: {
    _id,
    requesteditem,
    requesttype,
    comments,
    quantity,
    appovermatrix,
    date,
    Status,
    approvedby,
    name,
  },
}) => {
  return (
    <div className="profile bg-light">
      <img
        src="https://www.pngitem.com/pimgs/m/536-5366060_stationery-school-items-png-transparent-png.png"
        alt=""
        className="round-img"
      />
      <div>
        <h2>{requesteditem}</h2>
        <h4>Type : {requesttype}</h4>
        <p>requested by: {name}</p>
        <p>Approval Level: {appovermatrix} </p>
        <p>Quantity: {quantity}</p>

        {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user.useraccess !== "User" &&
          Status === "Submitted" && (
            <button
              onClick={(e) => approveInventory(_id)}
              type="button"
              className="btn btn-primary"
            >
              <i className="fas fa fa-check"></i>
              <span> Approve</span>
            </button>
          )}
        {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user.useraccess !== "User" &&
          Status === "Submitted" && (
            <button
              onClick={(e) => declineInventory(_id)}
              type="button"
              className="btn btn-danger"
            >
              <i className="fas fa fa-times"></i>
              <span> Decline</span>
            </button>
          )}
        {!auth.loading && Status === "Submitted" && name === auth.user.name && (
          <button
            onClick={(e) => deleteRequest(_id)}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>
      <ul>
        <h4>Reason: {comments}</h4>
        <p>Status: {Status}</p>
        {approvedby && <p>Approved By: {approvedby} </p>}
        <h4>
          <Moment format="DD/MM/YYYY">{date}</Moment>{" "}
        </h4>
      </ul>
    </div>
  );
};

RequestItem.propTypes = {
  request: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  approveInventory: PropTypes.func.isRequired,
  declineInventory: PropTypes.func.isRequired,
  deleteRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  approveInventory,
  declineInventory,
  deleteRequest,
})(withRouter(RequestItem));
