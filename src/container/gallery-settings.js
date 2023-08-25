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
    this.columnsMap = props.columns.reduce((map, column) => {
      map[column.key] = column;
      return map;
    }, {});
  }

  componentDidUpdate(prevProps) {
    if (this.props.appConfig.settings.fields_key !== prevProps.appConfig.settings.fields_key) {
      const newFields = this.getFields(this.props);
      this.setState({ fields: newFields });
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

    if (fields_key.length <= 0) {
      columns.forEach(column => {
        if (shown_title_name !== column.name) {
          fields_key.push(column.key);
        }
      });
    }

    let fields = [];
    const columnsMap = columns.reduce((map, column) => {
      map[column.key] = column;
      return map;
    }, {});

    fields_key.forEach(key => {
      let field;
      const column = columnsMap[key];
      if (shown_column_names.includes(column.name)) {
        field = {
          key: column.key,
          shown: true,
          name: column.name,
          type: column.type,
        }
      } else {
        field = {
          key: column.key,
          shown: false,
          name: column.name,
          type: column.type,
        }
      }
      if (shown_title_name !== column.name) {
        fields.push(field);
      }
    });
    return fields;
  }

  onToggleFieldsVisibility = (fieldAllShown) => {
    const { appConfig } = this.props;
    const { fields } = this.state;
    let shown_column_names = [];
    let updatedFields;
    if (fieldAllShown) {
      updatedFields = fields.map(field => {
        field.shown = false;
        return field;
      });
    } else {
      updatedFields = fields.map(field => {
        field.shown = true;
        shown_column_names.push(field.name);
        return field;
      });
    }
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.shown_column_names = shown_column_names;
    this.setState({ fields: updatedFields }, () => {
      this.props.onUpdateAppConfig(newAppConfig);
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
    const { appConfig, columns } = this.props;
    const { settings } = appConfig;
    const { fields_key, shown_column_names, shown_title_name } = settings;

    const dropColumnIndex = fields_key.findIndex(item => item === dropColumnKey);
    const dragColumnIndex = fields_key.findIndex(item => item === dragColumnKey);
    if (dropColumnIndex < 0 || dropColumnIndex >= fields_key.length || dragColumnIndex < 0 || dragColumnIndex >= fields_key.length) {
      return;
    }

    const tempColumnKey = fields_key[dropColumnIndex];
    fields_key[dropColumnIndex] = fields_key[dragColumnIndex];
    fields_key[dragColumnIndex] = tempColumnKey;

    let updatedFields = [];
    const columnsMap = columns.reduce((map, column) => {
      map[column.key] = column;
      return map;
    }, {});

    fields_key.forEach(key => {
      let field;
      const column = columnsMap[key];
      if (shown_column_names.includes(column.name)) {
        field = {
          key: column.key,
          shown: true,
          name: column.name,
          type: column.type,
        }
      } else {
        field = {
          key: column.key,
          shown: false,
          name: column.name,
          type: column.type,
        }
      }
      if (shown_title_name !== column.name) {
        updatedFields.push(field);
      }
    });

    this.setState({ fields: updatedFields });
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.settings.fields_key = fields_key;
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
