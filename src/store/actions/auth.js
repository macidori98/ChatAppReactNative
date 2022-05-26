import {
  AUTHENTICATE_USER,
  GET_AUTHENTICATE_USER,
  UPDATE_USER,
} from 'helpers/Constants';
import {User} from 'models';
import {
  AuthenticateUserActionReturnType,
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
 * @returns {{(dispatch: (data: {type: GET_AUTHENTICATE_USER}) => void)}}
 */
export const getAuthedUserData = () => {
  return dispatch => {
    dispatch({type: GET_AUTHENTICATE_USER});
  };
};
