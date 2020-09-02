import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getInventories } from "../../actions/inventory";
import InventoryItem from "./InventoryItem";

const Inventories = ({
  getInventories,
  inventory: { inventories, loading },
}) => {
  useEffect(() => {
    getInventories();
  }, [getInventories]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Inventory</h1>
          <Link to="/add-inventory" className="btn btn-light">
            <i className="fas fa-cart-plus text-primary"></i> Add/Update
            Inventory
          </Link>

          <div>
            <br />
            <p className="lead">
              <i className="fab fa-connectdevelop"></i>View Inventory
            </p>
          </div>
          <div className="profiles">
            {inventories.length > 0 ? (
              inventories.map((inventory) => (
                <InventoryItem key={inventory._id} inventory={inventory} />
              ))
            ) : (
              <h4>No Inventory Found!!</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Inventories.propTypes = {
  getInventories: PropTypes.func.isRequired,
  inventory: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  inventory: state.inventory,
});

export default connect(mapStateToProps, { getInventories })(Inventories);
