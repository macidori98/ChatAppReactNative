import {
  AUTHENTICATE_USER,
  GET_AUTHENTICATE_USER,
  LOG_OUT,
  UPDATE_USER,
} from 'helpers/Constants';
import {User} from 'models';
import {
  AuthenticateUserActionReturnType,
  GetAuthenticatedUserActionReturnType,
  LogOutActionReturnType,
  UpdateUserActionReturnType,
} from 'types/StoreTypes';

/**
 * @param {User} user
 * @returns {AuthenticateUserActionReturnType}
 */
export const authenticateUser = user => {
  return dispatch => {
    dispatch({type: AUTHENTICATE_USER, data: user});
  };
};

/**
 * @param {User} user
 * @returns {UpdateUserActionReturnType}
 */
export const updateUserData = user => {
  return dispatch => {
    dispatch({type: UPDATE_USER, data: user});
  };
};

/**
 * @returns {GetAuthenticatedUserActionReturnType}
 */
export const getAuthedUserData = () => {
  return dispatch => {
    dispatch({type: GET_AUTHENTICATE_USER});
  };
};

/**
 * @returns {LogOutActionReturnType}
 */
export const logout = () => {
  return dispatch => {
    dispatch({type: LOG_OUT});
  };
};
