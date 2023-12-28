import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import deepCopy from 'deep-copy';
import { FieldDisplaySetting } from 'dtable-ui-component';
import TableSetting from '../components/gallery-settings/table-setting';
import ViewSetting from '../components/gallery-settings/view-setting';
import ImageSetting from '../components/gallery-settings/image-setting';
import TitleSetting from '../components/gallery-settings/title-setting';
import DisplayFieldsSettings from '../components/gallery-settings/display-fields-settings';

import '../assets/css/gallery-settings.css';

const propTypes = {
  dtableUtils: PropTypes.object.isRequired,
  appConfig: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  views: PropTypes.array.isRequired,
  titleColumns: PropTypes.array.isRequired,
  imageColumns: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onUpdateAppConfig: PropTypes.func.isRequired,
};

class GallerySettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: this.getFields(props),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.appConfig.fields_key !== nextProps.appConfig.settings.fields_key) {
        const updatedFields = this.getFields(nextProps);
        this.setState({ fields: updatedFields });
      }
  }

  onSettingContainerClick = (event) => {
    event.stopPropagation();
  }

  getColumnIconConfig = () => {
    const { dtableUtils } = this.props;
    return dtableUtils.getColumnIconConfig()
  }

  getFields = (props) => {
    const { appConfig, columns } = props;
    const { shown_column_names = [], fields_key = [], shown_title_name  } = appConfig.settings;
    let fieldsKey = [...fields_key];
    if (fieldsKey.length === 0) {
      fieldsKey = columns.filter(column => column.name !== shown_title_name).map(column => column.key);
      appConfig.settings.fields_key = fieldsKey;
    }
    const columnsMap = columns.reduce((map, column) => {
      map[column.key] = column;
      return map;
    }, {});

    return fieldsKey.map(key => {
      const column = columnsMap[key];
      let field = {
        key: key,
        type: column.type,
        name: column.name,
      }
      field.shown = shown_column_names.includes(column.name) ? true : false;
      return field;
    });
  }

  onColumnItemClick = (columnKey, shownValue) => {
    const { appConfig } = this.props;
    const { fields } = this.state;
    const shown_column_names = [];
    const updatedFields = fields.map(field => {
      if (field.key === columnKey) {
        field.shown = shownValue;
      }
      if (field.shown) {
        shown_column_names.push(field.name);
      }
      return field;
    });

    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_column_names = shown_column_names;

    this.setState({ fields: updatedFields }, () => {
      this.props.onUpdateAppConfig(newAppConfig);
    });
  }

  onMoveColumn = (dropColumnKey, dragColumnKey) => {
    const { appConfig } = this.props;
    const { settings } = appConfig;
    const { fields_key } = settings;
    const dropIndex = fields_key.findIndex(field => field === dropColumnKey);
    const dragIndex = fields_key.findIndex(field => field === dragColumnKey);
    if (dropIndex < 0 || fields_key > fields_key.length || dragIndex < 0 || dragIndex > fields_key.length) {
      return;
    }
    const updatedFieldsKey = [...fields_key];
    const tempField = updatedFieldsKey[dropIndex];
    updatedFieldsKey[dropIndex] = updatedFieldsKey[dragIndex];
    updatedFieldsKey[dragIndex] = tempField;

    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.fields_key = updatedFieldsKey;
    this.props.onUpdateAppConfig(newAppConfig);
  }

  onToggleFieldsVisibility = (fieldAllShown) => {
    let shownColumnNames;
    if (fieldAllShown) {
      shownColumnNames = [];
    } else {
      const { fields } = this.state;
      shownColumnNames  = fields.map(field => field.name);
    }
    const { appConfig } = this.props;
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_column_names = shownColumnNames;
    this.props.onUpdateAppConfig(newAppConfig);
  }

  onSettingUpdate = (settings, type) => {
    this.props.onUpdateAppConfig(settings, type);
  }

  render() {

    const { appConfig, columns, tables, views, imageColumns, titleColumns } = this.props;
    const textProperties = {
      titleValue: intl.get('Other_fields_shown_in_gallery'),
      bannerValue: intl.get('Fields'),
      hideValue: intl.get('Hide_all'),
      showValue: intl.get('Show_all'),
    };
    const fieldAllShown = this.state.fields.every(field => field.shown);

    return (
      <div className="gallery-settings-container" onClick={this.onSettingContainerClick}>
        <div className="gallery-settings-header">{intl.get('Settings')}</div>
        <div className="gallery-settings-content" style={{maxHeight: window.innerHeight - 100}}>
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

          <div className='split-line'></div>
          <ImageSetting 
            appConfig={appConfig} 
            imageColumns={imageColumns}
            onSettingUpdate={this.onSettingUpdate}
          />
          <TitleSetting 
            columns={columns}
            appConfig={appConfig} 
            titleColumns={titleColumns}
            onSettingUpdate={this.onSettingUpdate}
          />
          <div className='split-line'></div>
          <DisplayFieldsSettings 
            appConfig={appConfig} 
            onSettingUpdate={this.onSettingUpdate}
          />
          <div className='split-line'></div>
          <div className="setting-item field-settings">
            <FieldDisplaySetting
              fields={this.state.fields}
              textProperties={textProperties}
              fieldAllShown={fieldAllShown}
              onClickField={this.onColumnItemClick}
              onMoveField={this.onMoveColumn}
              onToggleFieldsVisibility={() => this.onToggleFieldsVisibility(fieldAllShown)}
            />
          </div>
        </div>
      </div>
    );
  }
}

GallerySettings.propTypes = propTypes;

export default GallerySettings;
