/**
 * @param {string} date
 * @return {string}
 */
export const formatDate = date => {
  let datee;
  try {
    datee = new Date(date);
  } catch (error) {
    return undefined;
  }
  return datee.toDateString();
};
