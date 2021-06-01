import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import deepCopy from 'deep-copy';
import intl from 'react-intl-universal';
import Rename from '../common/rename';
import GalleryMain from '../container/gallery-main';
import GallerySettings from '../container/gallery-settings';
import { getImageColumns, getTitleColumns, isEditAppPage } from '../utils/utils';

import '../assets/css/layout.css'

const propTypes = {
  dtable: PropTypes.object.isRequired,
  appConfig: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  updateAppConfig: PropTypes.func.isRequired,
};

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSettings: null,
      isShowSharedDialog: false,
      isShowSetting: false
    };
  }

  getRows = (tableName, viewName) => {
    const { dtable } = this.props;
    let rows = [];
    dtable.forEachRow(tableName, viewName, (row) => {
      rows.push(row);
    });
    return rows;
  }

  getTableFormulaRows = (table, view) => {
    const { dtable } = this.props;
    let rows = dtable.getViewRows(view, table);
    return dtable.getTableFormulaResults(table, rows);
  }

  onUpdateCurrentName = (newName) => {
    const { appConfig } = this.props;
    const { name } = appConfig;
    if (name === newName) return;
    const newAppConfig = deepCopy(appConfig);
    newAppConfig.name = name;
    this.props.updateAppConfig(newAppConfig);
  }

  onShareDialogToggle = () => {
    alert('未实现');
  }
  
  onOpenShareApp = () => {
    alert('未实现');
  }

  onSettingsToggle = () => {
    this.setState({isShowSetting: !this.state.isShowSetting})
  }

  render() {
    const { dtable, appConfig } = this.props;
    const tables = dtable.getTables();
    const { table_name, view_name } = appConfig.settings;
    const selectedTable = tables.find(table => table.name === table_name);
    // visit app by shared link, the table in the settings has been deleted
    if (!isEditAppPage() && !selectedTable) {
      return (
        <div className="seatable-app seatable-app-gallery row no-gutters error-message">
          {intl.get('The_shared_app_has_expired_and_the_related_table_has_been_deleted')}
        </div>
      );
    }
    // visit app by shared link, the view in the settings has been deleted
    const views = dtable.getViews(selectedTable);
    const selectedView = views.find(view => view.name === view_name);
    if (!isEditAppPage() && !selectedView) {
      return (
        <div className="seatable-app seatable-app-gallery row no-gutters error-message">
          {intl.get('The_shared_app_has_expired_and_the_related_view_has_been_deleted')}
        </div>
      );
    }
    
    const columns = dtable.getColumns(selectedTable);
    const viewRows = this.getRows(selectedTable.name, selectedView.name);
    
    const formulaRows = this.getTableFormulaRows(selectedTable, selectedView);
    const titleColumns = getTitleColumns(dtable, columns);
    const imageColumns = getImageColumns(columns);

    const { isShowSetting } = this.state;
    const settingStyle = isShowSetting ?  {display: 'block'} : null;
    
    return (
      <div className="seatable-app seatable-app-gallery row no-gutters">
        <div className="col-auto seatable-app-gallery-main">
          <div className="row no-gutters gallery-main-header">
            <div className="col-auto gallery-name">
              <Rename isSupportRename={isEditAppPage()} currentName={'aaa'} onUpdateCurrentName={this.onUpdateCurrentName}/>
            </div>
            {isEditAppPage() && (
              <Fragment>
                <div className="col-md-6 d-none d-md-block">
                  <div className="gallery-options">
                    <button className="btn btn-outline-primary option-item" onClick={this.onShareDialogToggle}>
                      <i className="dtable-font dtable-icon-share mr-2"></i>
                      <span>{intl.get('Share')}</span>
                    </button>
                    <button className="btn btn-outline-primary option-item" onClick={this.onOpenShareApp}>
                      <i className="dtable-font dtable-icon-table mr-2"></i>
                      <span>{intl.get('App_page')}</span>
                    </button>
                  </div>
                </div>
                <div className="d-md-none col-6">
                  <div className="gallery-options">
                    <button className="btn btn-outline-primary option-item" onClick={this.onShareDialogToggle}>
                      <i className="dtable-font dtable-icon-share"></i>
                    </button>
                    <button className="btn btn-outline-primary option-item" onClick={this.onOpenShareApp}>
                      <i className="dtable-font dtable-icon-leave"></i>
                    </button>
                    <button className="btn btn-outline-primary option-item" onClick={this.onSettingsToggle}>
                      <i className="dtable-font dtable-icon-settings"></i>
                    </button>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <div className="gallery-main-content">
            <GalleryMain
              dtable={dtable}
              appConfig={appConfig}
              viewRows={viewRows}
              columns={columns}
              titleColumns={titleColumns}
              imageColumns={imageColumns}
              selectedView={selectedView}
              selectedTable={selectedTable}
              formulaRows={formulaRows}
            />
          </div>
        </div>
        {isEditAppPage() && (
          <div style={settingStyle} className="col-md-3 col-lg-2 seatable-app-gallery-settings" onClick={this.onSettingsToggle}>
            <GallerySettings 
              dtable={dtable}
              appConfig={appConfig}
              tables={tables}
              views={views}
              titleColumns={titleColumns}
              imageColumns={imageColumns}
              columns={columns}
              onUpdateAppConfig={this.props.updateAppConfig}
            />
          </div>
        )}
      </div>
    );
  }
}

Gallery.propTypes = propTypes;

export default Gallery;
