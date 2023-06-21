import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import PluginSelect from '../../common/select';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  views: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class ViewSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { appConfig } = this.props;
    if (name === appConfig.settings.view_name) {
      return;
    }
    let newAppConfig = deepCopy(appConfig);
    newAppConfig.settings = {
      table_name: newAppConfig.settings.table_name,
      view_name: name,
      shown_image_name: '',
      shown_title_name: '',
      shown_column_names: [],
    };

    this.props.onSettingUpdate(newAppConfig, 'view');
  }

  renderSelector = () => {
    const { appConfig, views } = this.props;
    const options = views
      .filter((view) => !view['private_for'])
      .map((item) => {
        let value = item['name'];
        let label = item['name'];
        return { value, label };
      });
    const { settings } = appConfig;
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
      <div className="setting-item view-setting">
        <div className="title">{intl.get('View')}</div>
        {this.renderSelector()}
      </div>
    );
  }
}

ViewSetting.propTypes = propTypes;

export default ViewSetting;
