import axios from "axios";
import { setAlert } from "./alert";

import {
  REQUEST_ERROR,
  GET_REQUESTS,
  CLEAR_REQUESTS,
  DELETE_REQUEST,
} from "./types";

// Get My Open Requests
export const getRequests = () => async (dispatch) => {
  dispatch({ type: CLEAR_REQUESTS });
  try {
    const res = await axios.get("/api/requests/myopen");
    dispatch({
      type: GET_REQUESTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all Requests

export const getAllRequests = () => async (dispatch) => {
  dispatch({ type: CLEAR_REQUESTS });
  try {
    const res = await axios.get("/api/requests");
    dispatch({
      type: GET_REQUESTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get request Log

export const getLog = () => async (dispatch) => {
  dispatch({ type: CLEAR_REQUESTS });
  try {
    const res = await axios.get("/api/requests/log");
    dispatch({
      type: GET_REQUESTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// create or update request
export const createRequest = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/requests", formData, config);
    dispatch({
      type: GET_REQUESTS,
      payload: res.data,
    });
    dispatch(setAlert("Request Created", "success"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch(setAlert("Item not Found!", "danger"));

    dispatch({
      type: REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Request
export const deleteRequest = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/requests/${id}`);
    dispatch({
      type: DELETE_REQUEST,
      payload: id,
    });
    dispatch(setAlert("Request Deleted", "success"));
  } catch (err) {
    dispatch({
      type: REQUEST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
