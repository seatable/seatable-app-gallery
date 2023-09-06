import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import PluginSelect from '../../common/select';

const propTypes = {
  columns: PropTypes.array.isRequired,
  appConfig: PropTypes.object.isRequired,
  titleColumns: PropTypes.array.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class TitleSetting extends React.Component {

  onSettingUpdate = (option) => {
    const { value: name } = option;
    const { appConfig, columns } = this.props;
    const { shown_title_name, fields_key } = appConfig.settings;
    if (name === appConfig.settings.shown_title_name) {
      return;
    }
    const columnsNameMap = columns.reduce((map, column) => {
      map[column.name] = column.key;
      return map;
    }, {});

    const fieldsKey = [ ...fields_key ];
    const oldTitleColumnKey = columnsNameMap[shown_title_name];
    const newTitleColumnKey = columnsNameMap[name];
    const newTitleColumnIndex = fieldsKey.findIndex(key => key === newTitleColumnKey);
    fieldsKey[newTitleColumnIndex] = oldTitleColumnKey;

    let newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_title_name = name;
    newAppConfig.settings.fields_key = fieldsKey;

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
      <div className="setting-item title-setting mb-0">
        <div className="title">{intl.get('Title_field')}</div>
        {this.renderSelector()}
      </div>
    );
  }
}

TitleSetting.propTypes = propTypes;

export default TitleSetting;
