import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import { DTableSelect } from 'dtable-ui-component';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class TableSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { appConfig } = this.props;
    if (name === appConfig.settings.table_name) {
      return;
    }
    let newAppConfig = deepCopy(appConfig);
    newAppConfig.settings = {
      table_name: name,
      view_name: '',
      shown_image_name: '',
      shown_title_name: '',
      shown_column_names: [],
      fields_key: [],
    };
    
    this.props.onSettingUpdate(newAppConfig, 'table');
  }

  renderSelector = () => {
    const { appConfig, tables } = this.props;
    const options = tables.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = appConfig;
    let selectedOption = options.find(item => item.value === settings['table_name']);
    if (!selectedOption) {
      selectedOption = options[0];
    }
    return (
      <DTableSelect
        value={selectedOption}
        options={options}
        onChange={this.onSettingUpdate}
      />
    );
  }

  render() {
    return (
      <div className="setting-item table-setting">
        <div className="title">{intl.get('Table')}</div>
        {this.renderSelector()}
      </div>
    );
  }
}

TableSetting.propTypes = propTypes;

export default TableSetting;
