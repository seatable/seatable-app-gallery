import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import ColumnSettingItem from './widgets/column-setting-item';

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
  getColumnIconConfig: PropTypes.func.isRequired,
};

class ColumnSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      columnSettings: [],
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { viewConfig, columns } = nextProps;
    const { shown_column_names } = viewConfig.settings;
    const columnIconConfig = nextProps.getColumnIconConfig();
    const columnSettings = columns.map(column => {
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

    return {columnSettings: columnSettings};
  }

  onUpdateColumnSetting = (columnSetting) => {
    let shown_column_names = [];
    const { columnSettings } = this.state;
    const newColumnSettings = columnSettings.map(setting => {
      if (setting.key === columnSetting.key) {
        setting = columnSetting;
      }
      if (setting.isChecked) {
        shown_column_names.push(setting.columnName);
      }
      return setting;
    });

    const { viewConfig } = this.props;
    const newViewConfig = deepCopy(viewConfig);
    newViewConfig.settings.shown_column_names = shown_column_names;
    this.setState({columnSettings: newColumnSettings}, () => {
      this.props.onSettingUpdate(newViewConfig); 
    });
  }

  render() {
    const { columnSettings } = this.state;

    return (
      <div>
        {columnSettings.map(setting => {
          return (
            <ColumnSettingItem 
              key={setting.key} 
              setting={setting} 
              onUpdateColumnSetting={this.onUpdateColumnSetting}
            />
          );
        })}
      </div>
    );
  }
}

ColumnSettings.propTypes = propTypes;

export default ColumnSettings;
