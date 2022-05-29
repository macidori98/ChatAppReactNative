export const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';

export const UPDATE_USER = 'UPDATE_USER';

export const LOG_OUT = 'LOG_OUT';

export const GET_AUTHENTICATE_USER = 'GET_AUTHENTICATE_USER';

export const SECRET_KEY = 'SECRET_KEY';

export const PUBLIC_KEY = 'PUBLIC_KEY';

export const LANGUAGE = 'LANGUAGE';

export {};
