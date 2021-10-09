import React from 'react';
import PropTypes from 'prop-types';
import Switch from '../common/switch';

const propTypes = {
  setting: PropTypes.object.isRequired,
  onUpdateFieldSetting: PropTypes.func.isRequired,
};

class MobileColumnSettingItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setting: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.setting) !== JSON.stringify(prevState.setting)) {
      return { setting: nextProps.setting };
    }
    return null;
  }

  onUpdateFieldSetting = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    const value = event.target.checked;
    const { setting } = this.state;
    if (setting.isChecked === value) {
      return;
    }
    const newSetting = Object.assign({}, setting, {isChecked: value});
    this.setState({setting: newSetting}, () => {
      this.props.onUpdateFieldSetting(newSetting);
    });
  }

  render() {
    const { setting } = this.state;
    const placeholder = (
      <div key={setting.key}>
        <i className={`dtable-font ${setting.columnIcon} mr-2`}></i>
        <span>{setting.columnName}</span>
      </div>
    );
    return (
      <div 
        className="mobile-column-setting-item" 
      >
        <Switch 
          checked={setting.isChecked}  
          placeholder={placeholder} 
          onChange={this.onUpdateFieldSetting} 
        />
      </div>
    );
  }
}

MobileColumnSettingItem.propTypes = propTypes;

export default MobileColumnSettingItem;
