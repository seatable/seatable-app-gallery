import React from 'react';
import PropTypes from 'prop-types';
import Switch from '../../../common/switch';

const propTypes = {
  setting: PropTypes.object.isRequired,
  onUpdateColumnSetting: PropTypes.func.isRequired,
};

class ColumnSettingItem extends React.PureComponent {

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

  onUpdateColumnSetting = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    const value = event.target.checked;
    const { setting } = this.state;
    if (setting.isChecked === value) {
      return;
    }
    const newSetting = Object.assign({}, setting, {isChecked: value});
    this.setState({setting: newSetting}, () => {
      this.props.onUpdateColumnSetting(newSetting);
    });
  }

  render() {

    const { setting } = this.state;
    const placeholder = (
      <div key={setting.key}>
        <i className={`dtable-font ${setting.columnIcon}`}></i>
        <span>{setting.columnName}</span>
      </div>
    );

    return (
      <Switch 
        checked={setting.isChecked}  
        placeholder={placeholder} 
        onChange={this.onUpdateColumnSetting} 
      />
    );
  }
}

ColumnSettingItem.propTypes = propTypes;

export default ColumnSettingItem;
