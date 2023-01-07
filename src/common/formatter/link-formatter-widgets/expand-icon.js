import React from 'react';
import PropTypes from 'prop-types';
import './expand-icon.css';

function ExpandIcon(props) {
  return (
    <span className="formatter-expand-icon" onClick={props.onClick}>
      <i className="dtable-font dtable-icon-open"></i>
    </span>
  );
}

ExpandIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ExpandIcon;
