import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import TableSetting from '../components/gallery-settings/table-setting';
import ViewSetting from '../components/gallery-settings/view-setting';
import ImageSetting from '../components/gallery-settings/image-setting';
import TitleSetting from '../components/gallery-settings/title-setting';
import FieldSettings from '../components/gallery-settings/field-settings';

import '../assets/css/gallery-settings.css';

const propTypes = {
  dtable: PropTypes.object.isRequired,
  appConfig: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  views: PropTypes.array.isRequired,
  titleColumns: PropTypes.array.isRequired,
  imageColumns: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onUpdateAppConfig: PropTypes.func.isRequired,
};

class GallerySettings extends React.Component {


  onSettingContainerClick = (event) => {
    event.stopPropagation();
  }

  getColumnIconConfig = () => {
    const { dtable } = this.props;
    return dtable.getColumnIconConfig()
  }

  onSettingUpdate = (settings, type) => {
    this.props.onUpdateAppConfig(settings, type);
  }

  render() {

    const { appConfig, tables, views, imageColumns, titleColumns, columns } = this.props;

    return (
      <div className="gallery-settings-container" onClick={this.onSettingContainerClick}>
        <div className="gallery-settings-header">{intl.get('Settings')}</div>
        <div className="gallery-settings-content" style={{maxHeight: window.innerHeight - 50}}>
          <TableSetting
            appConfig={appConfig} 
            tables={tables}
            onSettingUpdate={this.onSettingUpdate}
          />
          <ViewSetting
            appConfig={appConfig} 
            views={views}
            onSettingUpdate={this.onSettingUpdate}
          />
          <ImageSetting 
            appConfig={appConfig} 
            imageColumns={imageColumns}
            onSettingUpdate={this.onSettingUpdate}
          />
          <TitleSetting 
            appConfig={appConfig} 
            titleColumns={titleColumns}
            onSettingUpdate={this.onSettingUpdate}
          />
          <FieldSettings 
            appConfig={appConfig} 
            columns={columns}
            onSettingUpdate={this.onSettingUpdate}
            getColumnIconConfig={this.getColumnIconConfig}
          />
        </div>
      </div>
    );
  }
}

GallerySettings.propTypes = propTypes;

export default GallerySettings;
