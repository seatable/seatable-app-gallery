import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import PluginSelect from '../../common/select';

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
  imageColumns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class ImageSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { viewConfig } = this.props;
    if (name === viewConfig.settings.shown_image_name) {
      return;
    }
    let newViewConfig = deepCopy(viewConfig);
    newViewConfig.settings.shown_image_name = name;
    
    this.props.onSettingUpdate(newViewConfig);
  }

  renderSelector = () => {
    const { viewConfig, imageColumns } = this.props;
    const options = imageColumns.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = viewConfig;
    let selectedOption = options.find(item => item.value === settings['shown_image_name']);
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
        <div className="title">Column_filed</div>
        {this.renderSelector()}
      </div>
    );
  }
}

ImageSetting.propTypes = propTypes;

export default ImageSetting;
