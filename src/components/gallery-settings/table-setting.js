import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import PluginSelect from '../../common/select';

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class TableSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { viewConfig } = this.props;
    if (name === viewConfig.settings.table_name) {
      return;
    }
    let newViewConfig = deepCopy(viewConfig);
    newViewConfig.settings = {
      table_name: name,
      view_name: '',
      shown_image_name: '',
      shown_title_name: '',
      shown_column_names: [],
    };
    
    this.props.onSettingUpdate(newViewConfig);
  }

  renderSelector = () => {
    const { viewConfig, tables } = this.props;
    const options = tables.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = viewConfig;
    let selectedOption = options.find(item => item.value === settings['table_name']);
    if (!selectedOption) {
      selectedOption = options[0];
    }
    return (
      <PluginSelect
        value={selectedOption}
        options={options}
        onChange={this.onSettingUpdate}
      />
    );
  }

  render() {
    return (
      <div className="setting-item table-setting">
        <div className="title">Table</div>
        {this.renderSelector()}
      </div>
    );
  }
}

TableSetting.propTypes = propTypes;

export default TableSetting;
