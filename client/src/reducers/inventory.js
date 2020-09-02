import {
  GET_INVENTORY,
  GET_INVENTORIES,
  INVENTORY_ERROR,
  CLEAR_INVENTORY,
  GET_ITEMS,
} from "../actions/types";

const initialState = {
  inventories: [],
  inventory: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_INVENTORIES:
      return {
        ...state,
        inventories: payload,
        loading: false,
      };
    case GET_INVENTORY:
      return {
        ...state,
        inventory: payload,
        loading: false,
      };
    case GET_ITEMS:
      return {
        ...state,
        inventories: payload,
        loading: false,
      };
    case INVENTORY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_INVENTORY:
      return {
        ...state,
        inventories: [],
        inventory: null,
        loading: false,
      };

    default:
      return state;
  }
}
