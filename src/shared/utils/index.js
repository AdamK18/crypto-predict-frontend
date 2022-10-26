export const sortByTimeStamp = (array) => {
  return array.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
};
