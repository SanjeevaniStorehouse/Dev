import {
  REQUEST_ERROR,
  GET_REQUESTS,
  CLEAR_REQUESTS,
  DELETE_REQUEST,
} from "../actions/types";

const initialState = {
  request: null,
  requests: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_REQUESTS:
      return {
        ...state,
        requests: payload,
        loading: false,
      };
    case DELETE_REQUEST:
      return {
        ...state,
        requests: state.requests.filter((request) => request._id !== payload),
        loading: false,
      };
    case REQUEST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_REQUESTS:
      return {
        ...state,
        request: null,
        loading: false,
      };
    default:
      return state;
  }
}
