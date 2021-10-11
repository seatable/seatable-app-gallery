import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import MobileSettingItem from './mobile-setting-item';
import MobileShownColumns from './mobile-shown-columns';
import MobileSelectOption from './mobile-select-option';
import { SELECT_CONFIG_TYPE } from '../common/constants/select-config-type';

import '../assets/css/mobile-gallery-settings.css';

const propTypes = {
  appConfig: PropTypes.object,
  dtableUtils: PropTypes.object,
  tables: PropTypes.array,
  views: PropTypes.array,
  titleColumns: PropTypes.array,
  imageColumns: PropTypes.array,
  columns: PropTypes.array,
  onUpdateAppConfig: PropTypes.func,
  toggleSettingDialog: PropTypes.func,
};

class GalleryMobileSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowSelectOption: false,
      selectedConfigType: null
    } 
    this.options = [];
  }

  hideSelectConfig = () => {
    this.setState({
      isShowSelectOption: false
    });
  }

  onSelectOption = (selectedConfigType, name) => {
    const { appConfig } = this.props;
    this.setState({
      isShowSelectOption: false,
    });

    let newAppConfig = deepCopy(appConfig);
    let type;
    switch (selectedConfigType) {
      case SELECT_CONFIG_TYPE.TABLE_NAME: {
        newAppConfig.settings = {
          table_name: name,
          view_name: '',
          shown_image_name: '',
          shown_title_name: '',
          shown_column_names: [],
        };
        type = 'table';
        break;
      }
      case SELECT_CONFIG_TYPE.VIEW_NAME: {
        newAppConfig.settings = {
          table_name: newAppConfig.settings.table_name,
          view_name: name,
          shown_image_name: '',
          shown_title_name: '',
          shown_column_names: [],
        };
        type = 'view';
        break;
      }
      case SELECT_CONFIG_TYPE.SHOWN_IMAGE_NAME: {
        if (name === appConfig.settings.shown_image_name) {
          break;
        }
        newAppConfig.settings.shown_image_name = name;
        break;
      }
      case SELECT_CONFIG_TYPE.SHOWN_TITLE_NAME: {
        if (name === appConfig.settings.shown_title_name) {
          break;
        }
        newAppConfig.settings.shown_title_name = name;
        break;
      }
      default: 
        break;
    }

    this.props.onUpdateAppConfig(newAppConfig, type);
  }

  getSelectConfigOptions = (selectedConfigType) => {
    const { tables, views, titleColumns, imageColumns } = this.props;
    this.setState({
      isShowSelectOption: true,
      selectedConfigType
    });
    switch (selectedConfigType) {
      case SELECT_CONFIG_TYPE.TABLE_NAME: {
        this.options = tables;
        break;
      }
      case SELECT_CONFIG_TYPE.VIEW_NAME: {
        this.options = views;
        break;
      }
      case SELECT_CONFIG_TYPE.SHOWN_IMAGE_NAME: {
        this.options = imageColumns;
        break;
      }
      case SELECT_CONFIG_TYPE.SHOWN_TITLE_NAME: {
        this.options = titleColumns;
        break;
      }
      default: 
        break;
    }
  }

  getSelectedConfigTitle = (selectedConfigType) => {
    let title;
    switch (selectedConfigType) {
      case SELECT_CONFIG_TYPE.TABLE_NAME: {
        title = intl.get('Table');
        break;
      }
      case SELECT_CONFIG_TYPE.VIEW_NAME: {
        title = intl.get('View');
        break;
      }
      case SELECT_CONFIG_TYPE.SHOWN_IMAGE_NAME: {
        title = intl.get('Image_field');
        break;
      }
      case SELECT_CONFIG_TYPE.SHOWN_TITLE_NAME: {
        title = intl.get('Title_field');
        break;
      }
      default: 
        break;
    }
    return title;
  }

  getColumnIconConfig = () => {
    const { dtableUtils } = this.props;
    return dtableUtils.getColumnIconConfig();
  }

  render() {
    const { toggleSettingDialog, appConfig, columns } = this.props;
    const { selectedConfigType, isShowSelectOption } = this.state;
    const { settings } = appConfig;
    const configTypeSettings = Object.keys(settings);
    const selectedTitle = this.getSelectedConfigTitle(selectedConfigType);

    return (
      <div className="gallery-app-settings">
         <div className="dtable-gallery-app-title">
          <span onClick={toggleSettingDialog} className="dtable-gallery-app-header-btn">{intl.get('Cancel')}</span>
          <h4 className="dtable-gallery-app-header-title">{intl.get('Settings')}</h4>
          <span onClick={toggleSettingDialog} className="dtable-gallery-app-header-btn-highlight dtable-gallery-app-header-btn">{intl.get('Save')}</span>
        </div>
        <div className="dtable-gallery-app-setting-wrapper">
          {configTypeSettings.map(configTypeSetting => {
            if (configTypeSetting === SELECT_CONFIG_TYPE.SHOWN_COLUMN_NAMES) {
              return (<MobileShownColumns
                key={configTypeSetting}
                appConfig={appConfig}
                columns={columns}
                onSettingUpdate={this.props.onUpdateAppConfig}
                getColumnIconConfig={this.getColumnIconConfig}
              />);
            } else {
              const title = this.getSelectedConfigTitle(configTypeSetting);
              return <MobileSettingItem 
                key={configTypeSetting}
                selectedConfigType={configTypeSetting}
                getSelectConfigOptions={this.getSelectConfigOptions}
                selectedName={settings[configTypeSetting]}
                title={title}
              />
            }
          })}
        </div>
        {isShowSelectOption &&
          <MobileSelectOption
            onSelectOption={this.onSelectOption}
            selectedConfigType={selectedConfigType}
            hideSelectConfig={this.hideSelectConfig}
            settings={settings}
            options={this.options}
            title={selectedTitle}
          />
        } 
      </div>
    );
  }
}

GalleryMobileSettings.propTypes = propTypes;

export default GalleryMobileSettings;
