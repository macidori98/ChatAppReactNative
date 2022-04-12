import {AUTHENTICATE_USER, GET_AUTHENTICATE_USER} from 'helpers/Constants';
import {User} from 'models';
import {AuthenticateUserActionReturnType} from 'types/StoreTypes';

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
 * @returns {{(dispatch: (data: {type: GET_AUTHENTICATE_USER}) => void)}}
 */
export const getAuthedUserData = () => {
  return dispatch => {
    dispatch({type: GET_AUTHENTICATE_USER});
  };
};
