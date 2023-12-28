import React from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import { DTableSwitch } from 'dtable-ui-component';

const propTypes = {
  appConfig: PropTypes.object,
  onUpdateAppConfig: PropTypes.func,
}

class MobileDisplayFieldsName extends React.Component {

  constructor(props) {
    const { settings } = props.appConfig;
    super(props);
    this.state = {
      isChecked: settings.display_field_name || false,
    }
  }

  onUpdateFieldSetting = () => {
    let { appConfig } = this.props;
    let newAppConfig = deepCopy(appConfig);
    const updateShowColumnName = !this.state.isChecked;
    newAppConfig.settings.display_field_name = updateShowColumnName;
    this.props.onUpdateAppConfig(newAppConfig);
    this.setState({isChecked: updateShowColumnName});
  }

  render() {
    return (
      <div className="mobile-setting-item mt-4">
        <div className="mobile-column-setting-item">
          <DTableSwitch
            checked={this.state.isChecked}
            placeholder={intl.get('Show_field_names')}
            onChange={this.onUpdateFieldSetting}
            switchClassName="mobile-field-switch-container"
          />
        </div>
      </div>
    );
  }
}

MobileDisplayFieldsName.propTypes = propTypes;

export default MobileDisplayFieldsName;
