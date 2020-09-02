//import Moment from "react-moment";
import React, { Fragment, useEffect } from "react";
//import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRequests } from "../../actions/request";
import Spinner from "../layout/Spinner";
import RequestItem from "../requests/RequestItem";

const Requests = ({ getRequests, request: { requests, loading } }) => {
  useEffect(() => {
    getRequests();
  }, [getRequests]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className="profiles">
            {requests.length > 0 ? (
              requests.map((request) => (
                <RequestItem key={request._id} request={request} />
              ))
            ) : (
              <h4>You have no Open Requests!</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Requests.propTypes = {
  getRequests: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  request: state.request,
});

export default connect(mapStateToProps, { getRequests })(Requests);
