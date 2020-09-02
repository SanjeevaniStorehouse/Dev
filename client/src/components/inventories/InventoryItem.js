import React from "react";
//import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Moment from "react-moment";

const InventoryItem = ({
  inventory: {
    //user: { _id, name },
    itemname,
    description,
    quantity,
    appovermatrix,
    date,
    name,
  },
}) => {
  return (
    <div className="profile bg-light">
      <img
        src="https://www.netclipart.com/pp/m/75-755640_school-supplies-png-stationery-items-png.png"
        alt=""
        className="round-img"
      />
      <div>
        <h2>{itemname}</h2>
        <p>Approval Level: {appovermatrix} </p>
        <p>
          In Stock: <span> {quantity} </span>
        </p>
        <p> </p>
      </div>
      <ul>
        <h4>{description}</h4>
        <ul>
          <li class="text-primary">
            <i class="fas fa-check"></i> Created on:
            <Moment format="DD/MM/YYYY">{date}</Moment>
          </li>
          <li class="text-primary">
            <i class="fas fa-check"></i> Created by: {name}
          </li>
        </ul>
      </ul>
    </div>
  );
};

InventoryItem.propTypes = {
  inventory: PropTypes.object.isRequired,
};

export default InventoryItem;
