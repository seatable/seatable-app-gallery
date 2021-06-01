import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import PluginSelect from '../../common/select';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  titleColumns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class TitleSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { appConfig } = this.props;
    if (name === appConfig.settings.shown_title_name) {
      return;
    }
    let newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_title_name = name;
    
    this.props.onSettingUpdate(newAppConfig);
  }

  renderSelector = () => {
    const { appConfig, titleColumns } = this.props;
    const options = titleColumns.map((item) => {
      let value = item['name'];
      let label = item['name'];
      return {value, label};
    });
    const { settings } = appConfig;
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
      <div className="setting-item title-setting">
        <div className="title">{intl.get('Title_field')}</div>
        {this.renderSelector()}
      </div>
    );
  }
}

TitleSetting.propTypes = propTypes;

export default TitleSetting;
