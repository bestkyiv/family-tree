import PropTypes from "prop-types";

const statuses = {
  observer: 'Observer',
  baby: 'Baby',
  guest: 'Guest',
  full: 'Full',
  alumni: 'Alumni',
};

const statusesType = PropTypes.oneOf(Object.values(statuses));

export default statuses;
export { statusesType };
