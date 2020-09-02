import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllRequests } from "../../actions/request";
import Spinner from "../layout/Spinner";
import RequestItem from "./RequestItem";

const Requests = ({ getAllRequests, request: { requests, loading } }) => {
  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Requests</h1>
          <Link to="/create-request" className="btn btn-light">
            <i className="fas fa-cart-plus text-primary"></i> New Request
          </Link>
          <Link to="/log" className="btn btn-light">
            <i className="fas fa-archive"></i> Request Log
          </Link>
          <div>
            <br />
            <p className="lead">
              <i className="fab fa-connectdevelop"></i>View Requests
            </p>
          </div>
          <div className="profiles">
            {requests.length > 0 ? (
              requests.map((request) => (
                <RequestItem key={request._id} request={request} />
              ))
            ) : (
              <h4>No open Requests found!!</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Requests.propTypes = {
  getAllRequests: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  request: state.request,
});

export default connect(mapStateToProps, { getAllRequests })(Requests);
