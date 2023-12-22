import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import { DTableSelect } from 'dtable-ui-component';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  imageColumns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class ImageSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { appConfig } = this.props;
    if (name === appConfig.settings.shown_image_name) {
      return;
    }
    let newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_image_name = name;
    
    this.props.onSettingUpdate(newAppConfig);
  }

  renderSelector = () => {
    const { appConfig, imageColumns } = this.props;
    const options = imageColumns.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = appConfig;
    let selectedOption = options.find(item => item.value === settings['shown_image_name']);
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
      <div className="setting-item image-setting">
        <div className="title">{intl.get('Image_field')}</div>
        {this.renderSelector()}
      </div>
    );
  }
}

ImageSetting.propTypes = propTypes;

export default ImageSetting;
