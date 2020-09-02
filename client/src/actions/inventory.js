import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_INVENTORIES,
  INVENTORY_ERROR,
  CLEAR_INVENTORY,
  GET_INVENTORY,
  DELETE_REQUEST,
  GET_ITEMS,
} from "./types";

// Get all inventory
export const getInventories = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/inventory");
    dispatch({
      type: GET_INVENTORIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INVENTORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get selected item inventory
export const getItemInventory = (itemName) => async (dispatch) => {
  dispatch({
    type: CLEAR_INVENTORY,
  });
  try {
    const res = await axios.get(`/api/inventory/${itemName}`);
    dispatch({
      type: GET_INVENTORY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INVENTORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add or update Inventory
export const createInventory = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/inventory", formData, config);
    dispatch({
      type: GET_INVENTORY,
      payload: res.data,
    });
    dispatch(
      setAlert(edit ? "Inventory Updated" : "Inventory Created", "success")
    );

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: INVENTORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Approve Request
export const approveInventory = (id) => async (dispatch) => {
  try {
    await axios.put(`/api/inventory/approve/${id}`);
    dispatch({
      type: DELETE_REQUEST,
      payload: id,
    });
    dispatch(setAlert("Request Approved!", "success"));
  } catch (err) {
    dispatch(setAlert("Insufficiant Quantity", "danger"));
    dispatch({
      type: INVENTORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Decline Request
export const declineInventory = (id) => async (dispatch) => {
  try {
    await axios.put(`/api/inventory/decline/${id}`);
    dispatch({
      type: DELETE_REQUEST,
      payload: id,
    });
    dispatch(setAlert("Request Denied!", "success"));
  } catch (err) {
    dispatch({
      type: INVENTORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all Inventory Items
export const getItems = () => async (dispatch) => {
  dispatch({ type: CLEAR_INVENTORY });
  try {
    const res = await axios.get("api/inventory/items");
    dispatch({
      type: GET_ITEMS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INVENTORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
