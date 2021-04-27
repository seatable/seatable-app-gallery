import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import PluginSelect from '../../common/select';

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
  titleColumns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class TitleSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { viewConfig } = this.props;
    if (name === viewConfig.settings.shown_title_name) {
      return;
    }
    let newViewConfig = deepCopy(viewConfig);
    newViewConfig.settings.shown_title_name = name;
    
    this.props.onSettingUpdate(newViewConfig);
  }

  renderSelector = () => {
    const { viewConfig, titleColumns } = this.props;
    const options = titleColumns.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = viewConfig;
    let selectedOption = options.find(item => item.value === settings['shown_title_name']);
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
        <div className="title">Title_filed</div>
        {this.renderSelector()}
      </div>
    );
  }
}

TitleSetting.propTypes = propTypes;

export default TitleSetting;
