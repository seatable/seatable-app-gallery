import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import FieldSettingItem from './widgets/field-setting-item';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
  getColumnIconConfig: PropTypes.func.isRequired,
};

class FieldSettings extends React.Component {

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
      if (shown_column_names.includes(column.name)) {
        return {
          key: column.key,
          isChecked: true,
          columnName: column.name,
          columnIcon: columnIcon,
        };
      }
      return {
        key: column.key,
        isChecked: false,
        columnName: column.name,
        columnIcon: columnIcon,
      };
    })

    return {fieldSettings: fieldSettings};
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
      return <span className="setting-choose-all" onClick={this.onHideAllColumns}>{intl.get('Hide_all')}</span>;
    }
    return <span className="setting-choose-all" onClick={this.onChooseAllColumns}>{intl.get('Show_all')}</span>;
  }

  render() {
    const { fieldSettings } = this.state;

    return (
      <div className="setting-item field-settings">
        <div className="field-settings-header">
          <span>{intl.get('Other_fields')}</span>
          {this.renderChooseFields()}
        </div>
        <div className="field-settings-body">
          {fieldSettings.map(setting => {
            return (
              <FieldSettingItem 
                key={setting.key} 
                setting={setting} 
                onUpdateFieldSetting={this.onUpdateFieldSetting}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

FieldSettings.propTypes = propTypes;

export default FieldSettings;
