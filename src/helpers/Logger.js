import {format as prettyFormat} from 'pretty-format';

export const Logger = {
  log: value => console.log(prettyFormat(value)),
};
