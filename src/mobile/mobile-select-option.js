import React, { Component } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import TouchFeedBack from './touch-feedback';

const propTypes = {
  title: PropTypes.string,
  selectedConfigType: PropTypes.string,
  settings: PropTypes.object,
  options: PropTypes.array,
  onSelectOption: PropTypes.func,
  hideSelectConfig: PropTypes.func,
};

class MobileSelectOption extends Component {
  
  onClick = (option) => {
    const { selectedConfigType } = this.props;
    this.props.onSelectOption(selectedConfigType, option.name);
  }

  renderOptions = () => {
    const { selectedConfigType, options, settings, title } = this.props;
    return (
      <div className="mobile-setting-item">
        <div className="mobile-setting-title">
          {intl.get('Please_select') + title}
        </div>
        <div className="mobile-select-options">
          {  
            options.map((settingItem) => {
              return (
                <TouchFeedBack key={settingItem._id || settingItem.key} activeClassName="selected-selector">
                  <div
                    onClick={() => this.onClick(settingItem)}
                    className="mobile-select-option"
                  >
                    <div className="mobile-selector-option-wrapper">
                      <span>{settingItem.name}</span>
                      {settingItem.name === settings[selectedConfigType] && <div className="mobile-selector-icon">
                        <i className="dtable-font dtable-icon-check-mark"></i>
                      </div>}
                    </div>
                  </div>
                </TouchFeedBack>
              )
            })
          }
        </div>
      </div>
    );
  }

  render() { 
    const { hideSelectConfig, title } = this.props;
    return ( 
      <div className="gallery-app-settings">
        <div className="dtable-gallery-app-title">
          <span onClick={hideSelectConfig} className="dtable-gallery-app-header-btn"><i className="dtable-font dtable-icon-return"></i></span>
          <h4 className="dtable-gallery-app-header-title">{title}</h4>
          <span className="dtable-gallery-app-header-btn-highlight dtable-gallery-app-header-btn"></span>
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}

MobileSelectOption.propTypes = propTypes;
 
export default MobileSelectOption;
