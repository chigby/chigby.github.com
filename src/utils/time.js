'use strict';

const { parseISO, format } = require('date-fns');

const date = (dateObj, fmt) => {
  let d;
  if (!dateObj) {
    d = Date.now();
  } else if (dateObj instanceof Date) {
    d = dateObj;
  } else {
    d = parseISO(dateObj);
  }
  return format(d, fmt);
};

module.exports = {
  date,
};
