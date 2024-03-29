import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import { DTableSwitch } from 'dtable-ui-component';

const propTypes = {
  appConfig: PropTypes.object.isRequired,
  onSettingUpdate: PropTypes.func.isRequired,
};

class DisplayFieldsSettings extends React.Component {

  constructor(props) {
    super(props);
    const { settings } = props.appConfig;
    this.state = {
      isShowColumnName: settings.display_field_name || false,
    };
  }

  showColumnNameToggle = () => {
    let { appConfig } = this.props;
    let newAppConfig = deepCopy(appConfig);
    const updateShowColumnName = !this.state.isShowColumnName;
    newAppConfig.settings.display_field_name = updateShowColumnName;
    this.props.onSettingUpdate(newAppConfig);
    this.setState({isShowColumnName: updateShowColumnName});
  }

  render() {
    const { isShowColumnName } = this.state;
    return (
      <div className="setting-item display-field-settings mb-0">
        <DTableSwitch
          checked={isShowColumnName}
          placeholder={intl.get('Show_field_names')}
          onChange={this.showColumnNameToggle}
          switchClassName='pl-0'
        />
      </div>
    );
  }
}

DisplayFieldsSettings.propTypes = propTypes;

export default DisplayFieldsSettings;
