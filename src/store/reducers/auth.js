import {
  AuthenticateDataAction,
  AuthenticateState,
  GetAuthenticatedUserAction,
  LogOutDataAction,
  UpdateDataAction,
} from 'types/StoreTypes';

/** @type {AuthenticateState} */
const initialState = {
  authedUser: undefined,
};

/**
 * @param {AuthenticateState} state
 * @param {AuthenticateDataAction|LogOutDataAction|GetAuthenticatedUserAction|UpdateDataAction} action
 * @returns {AuthenticateState}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATE_USER':
      return {authedUser: action.data};
    case 'GET_AUTHENTICATE_USER':
      return {...state};
    case 'LOG_OUT':
      console.log('REDUX LOGOUT');
      return initialState;
    case 'UPDATE_USER':
      return {...state, authedUser: action.data};
    default:
      return initialState;
  }
};
