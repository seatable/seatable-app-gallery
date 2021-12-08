import React, { Component } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import deepCopy from 'deep-copy';
import ColumnSettingItem from './mobile-column-setting-item';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
  getColumnIconConfig: PropTypes.func.isRequired,
};

class MobileShownColumns extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fieldSettings: [],
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { appConfig, columns } = nextProps;
    const { shown_column_names } = appConfig.settings;
    const columnIconConfig = nextProps.getColumnIconConfig();
    const fieldSettings = columns.map(column => {
      const columnIcon = columnIconConfig[column.type];
      return {
        key: column.key,
        isChecked: shown_column_names.includes(column.name),
        columnName: column.name,
        columnIcon: columnIcon,
      };
    })

    return {fieldSettings: fieldSettings};
  }
  
  toggleSelectAll = (value) => {
    this.props.toggleAllColumns(value);
  }

  onChooseAllColumns = () => {
    let shown_column_names = [];
    const { fieldSettings } = this.state;
    const newFieldSettings = fieldSettings.map(setting => {
      setting.isChecked = true;
      shown_column_names.push(setting.columnName);
      return setting;
    });
    const { appConfig } = this.props;
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_column_names = shown_column_names;
    this.setState({fieldSettings: newFieldSettings}, () => {
      this.props.onSettingUpdate(newAppConfig);
    });
  }

  onHideAllColumns = () => {
    let shown_column_names = [];
    const { fieldSettings } = this.state;
    const newFieldSettings = fieldSettings.map(setting => {
      setting.isChecked = false;
      shown_column_names.push(setting.columnName);
      return setting;
    });
    const { appConfig } = this.props;
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_column_names = [];
    this.setState({fieldSettings: newFieldSettings}, () => {
      this.props.onSettingUpdate(newAppConfig);
    });
  }


  onUpdateFieldSetting = (columnSetting) => {
    let shown_column_names = [];
    const { fieldSettings } = this.state;
    const newFieldSettings = fieldSettings.map(setting => {
      if (setting.key === columnSetting.key) {
        setting = columnSetting;
      }
      if (setting.isChecked) {
        shown_column_names.push(setting.columnName);
      }
      return setting;
    });

    const { appConfig } = this.props;
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_column_names = shown_column_names;
    this.setState({fieldSettings: newFieldSettings}, () => {
      this.props.onSettingUpdate(newAppConfig);
    });
  }

  renderChooseFields = () => {
    let { fieldSettings } = this.state;
    let isShowHideChoose = fieldSettings.length > 0 && fieldSettings.every(setting => setting.isChecked);
    if (isShowHideChoose) {
      return <span onClick={this.onHideAllColumns}>{intl.get('Hide_all')}</span>
    } else {
      return <span onClick={this.onChooseAllColumns}>{intl.get('Show_all')}</span>
    }
  }

  render() {
    const { fieldSettings } = this.state;
    return (
      <div className="mobile-setting-item mt-4">
        <div className="mobile-setting-title">
          <div>{intl.get('Other_fields')}</div>
          <div className="mobile-select-all">
            {this.renderChooseFields()}
          </div>
        </div>
        {fieldSettings.map(setting => {
          return (
            <ColumnSettingItem
              key={setting.key} 
              setting={setting} 
              onUpdateFieldSetting={this.onUpdateFieldSetting}
            />
          );
        })}
      </div>
    );
  }
}

MobileShownColumns.propTypes = propTypes;

export default MobileShownColumns;
