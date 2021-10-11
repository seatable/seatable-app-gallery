import React, { Component } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { List } from 'antd-mobile';

const propTypes = {
  title: PropTypes.string,
  selectedConfigType: PropTypes.string,
  settings: PropTypes.object,
  options: PropTypes.array,
  onSelectOption: PropTypes.func,
  hideSelectConfig: PropTypes.func,
};

const Item = List.Item;

class MobileSelectOption extends Component {
  
  onClick = (option) => {
    const { selectedConfigType } = this.props;
    this.props.onSelectOption(selectedConfigType, option.name);
  }

  renderOptions = () => {
    const { selectedConfigType, options, settings } = this.props;
    return (
      <div className="mobile-setting-item">
        <div className="mobile-select-options">
          <List renderHeader={intl.get('Please_select')}>
            {options.map((settingItem) => {
              return (
                <Item 
                  key={settingItem._id || settingItem.key} 
                  onClick={() => this.onClick(settingItem)}
                  extra={settingItem.name === settings[selectedConfigType] && <i className="dtable-font dtable-icon-check-mark"></i>}
                >
                  {settingItem.name}
                </Item>
              );
            })}
           </List>
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
