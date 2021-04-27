import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import PluginSelect from '../../common/select';

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
  views: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class ViewSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { viewConfig } = this.props;
    if (name === viewConfig.settings.view_name) {
      return;
    }
    let newViewConfig = deepCopy(viewConfig);
    newViewConfig.settings = {
      table_name: newViewConfig.settings.table_name,
      view_name: name,
      shown_image_name: '',
      shown_title_name: '',
      shown_column_names: [],
    };

    this.props.onSettingUpdate(newViewConfig);
  }

  renderSelector = () => {
    const { viewConfig, views } = this.props;
    const options = views.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = viewConfig;
    let selectedOption = options.find(item => item.value === settings['view_name']);
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
        <div className="title">View</div>
        {this.renderSelector()}
      </div>
    );
  }
}

ViewSetting.propTypes = propTypes;

export default ViewSetting;
