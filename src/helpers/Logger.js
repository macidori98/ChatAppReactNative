import {format as prettyFormat} from 'pretty-format';

export const Logger = {
  /**
   * @param {any} value
   * @returns {void}
   */
  log: value => console.log(prettyFormat(value)),
};
