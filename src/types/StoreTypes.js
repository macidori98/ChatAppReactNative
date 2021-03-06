import {
  AUTHENTICATE_USER,
  LOG_OUT,
  GET_AUTHENTICATE_USER,
  UPDATE_USER,
} from 'helpers/Constants';
import {User} from 'models';

/**
 * @typedef {{data: User, type: AUTHENTICATE_USER}} AuthenticateDataAction
 */

/**
 * @typedef {{data: User, type: UPDATE_USER}} UpdateDataAction
 */

/**
 * @typedef {{type: LOG_OUT}} LogOutDataAction
 */

/**
 * @typedef {{type: GET_AUTHENTICATE_USER}} GetAuthenticatedUserAction
 */

/**
 * @typedef {{authedUser: User}} AuthenticateState
 */

/**
 * @typedef {{(dispatch: (data: AuthenticateDataAction) => void)}} AuthenticateUserActionReturnType
 */

/**
 * @typedef {{(dispatch: (data: UpdateDataAction) => void)}} UpdateUserActionReturnType
 */

/**
 * @typedef {{(dispatch: (data: GetAuthenticatedUserAction) => void)}} GetAuthenticatedUserActionReturnType
 */

/**
 * @typedef {{(dispatch: (data: LogOutDataAction) => void)}} LogOutActionReturnType
 */

export {};
