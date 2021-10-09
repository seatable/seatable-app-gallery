
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TouchFeedBack from './touch-feedback';

const propTypes = {
  title: PropTypes.string,
  selectedConfigType: PropTypes.string,
  selectedName: PropTypes.string,
  getSelectConfigOptions: PropTypes.func,
};

class MobileSettingItem extends Component {

  onClick = () => {
    this.props.getSelectConfigOptions(this.props.selectedConfigType)
  }

  render() { 
    const { title, selectedName } = this.props;

    return (
      <div className="mobile-setting-item">
        <div className="mobile-setting-title">{title}</div>
        <TouchFeedBack activeClassName="selected-selector">
          <div onClick={this.onClick} className="mobile-selector">
            <span>{selectedName}</span>
            <div className="mobile-selector-icon">
              <i className="dtable-font dtable-icon-right"></i>
            </div>
          </div>
        </TouchFeedBack>
      </div>
    )
  }
}

MobileSettingItem.propTypes = propTypes;
 
export default MobileSettingItem;
