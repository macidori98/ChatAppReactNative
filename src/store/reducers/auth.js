import {
  AuthenticateDataAction,
  AuthenticateState,
  GetAuthenticatedUserAction,
  LogOutDataAction,
} from 'types/StoreTypes';

/** @type {AuthenticateState} */
const initialState = {
  authedUser: undefined,
};

/**
 * @param {AuthenticateState} state
 * @param {AuthenticateDataAction|LogOutDataAction|GetAuthenticatedUserAction} action
 * @returns {AuthenticateState}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATE_USER':
      return {authedUser: action.data};
    case 'GET_AUTHENTICATE_USER':
      return {...state};
    case 'LOG_OUT':
      return initialState;
    default:
      return initialState;
  }
};
