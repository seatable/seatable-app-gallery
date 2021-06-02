import React from 'react';
import DTable from 'dtable-sdk';
import intl from 'react-intl-universal';
import context from './context.js';
import Gallery from './pages/gallery.js';
import Loading from './common/loading';
import toaster from './common/toaster';
import { dtableWebAPI } from './utils/dtable-web-api';
import { getImageColumns, getTitleColumns, isEditAppPage } from './utils/utils.js';

import './locale/index.js'

const appConfig = context.getSetting('appConfig');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      appConfig: JSON.parse(appConfig),
      isSaving: false,
      isShowSaveMessage: false,
    };
    this.dtable = new DTable();
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  componentWillUnmount() {
    this.unsubscribeLocalDtableChanged();
    this.unsubscribeRemoteDtableChanged();
  }

  async initPluginDTableData() {
    // get accessToken
    await this.dtable.initDTableApp(context.getConfig());
    await this.dtable.syncWithServer();
    this.dtable.subscribe('dtable-connect', () => { this.onDTableConnect(); });
    this.unsubscribeLocalDtableChanged = this.dtable.subscribe('local-dtable-changed', () => { this.onDTableChanged(); });
    this.unsubscribeRemoteDtableChanged = this.dtable.subscribe('remote-dtable-changed', () => { this.onDTableChanged(); });
    this.resetData(true);
  }

  onDTableConnect = () => {
    this.resetData();
  }

  onDTableChanged = () => {
    this.resetData();
  }

  resetData = (isFirstLoaded) => {
    let settings = null;
    const { appConfig } = this.state;
    const { table_name, view_name, shown_image_name, shown_title_name } = appConfig.settings || {};
    if (isFirstLoaded && isEditAppPage()) {
      // loaded by first time
      if (!table_name) {
        const tables = this.dtable.getTables();
        const selectedTable = tables[0];
        const views = this.dtable.getViews(selectedTable);
        const selectedView = views[0];
        const columns = this.dtable.getColumns(selectedTable);
        const imageColumns = getImageColumns(columns);
        const titleColumns = getTitleColumns(this.dtable, columns);

        settings = {
          table_name: selectedTable.name,
          view_name: selectedView.name,
          shown_image_name: imageColumns[0].name,
          shown_title_name: titleColumns[0].name,
          shown_column_names: []
        };

        const newAppConfig = Object.assign({}, appConfig, {settings});
        this.setState({
          appConfig: newAppConfig,
          isLoading: false
        });
        return;
      }

      // valid visit external app settings
      const tables = this.dtable.getTables();
      const selectedTable = tables.find(table => table.name === table_name);

      // the table in settings has been deleted
      if (!selectedTable) {
        const selectedTable = tables[0];
        const views = this.dtable.getViews(selectedTable);
        const selectedView = views[0];
        const columns = this.dtable.getColumns(selectedTable);
        const imageColumns = getImageColumns(columns);
        const titleColumns = getTitleColumns(this.dtable, columns);

        settings = {
          table_name: selectedTable.name,
          view_name: selectedView.name,
          shown_image_name: imageColumns[0] && imageColumns[0].name,
          shown_title_name: titleColumns[0] && titleColumns[0].name,
          shown_column_names: []
        };
        const newAppConfig = Object.assign({}, appConfig, {settings});
        this.setState({
          appConfig: newAppConfig,
          isLoading: false
        });
        return;
      }

      const columns = this.dtable.getColumns(selectedTable);
      const imageColumns = getImageColumns(columns);
      const titleColumns = getTitleColumns(this.dtable, columns);

      const views = this.dtable.getViews(selectedTable);
      const selectedView = views.find(view => view.name === view_name);
      
      // the view in settings has been deleted
      if (selectedTable && !selectedView) {
        settings = {
          table_name: selectedTable.name,
          view_name: views[0].name,
          shown_image_name: imageColumns[0] && imageColumns[0].name,
          shown_title_name: titleColumns[0] && titleColumns[0].name,
          shown_column_names: []
        };
        const newAppConfig = Object.assign({}, appConfig, {settings});
        this.setState({
          appConfig: newAppConfig,
          isLoading: false
        });
        return;
      }

      const isImageExist = imageColumns.find(column => column.name === shown_image_name);
      const isTitleExist = titleColumns.find(column => column.name === shown_title_name);

      // the shown column in settings has been deleted
      if (!isImageExist || !isTitleExist) {
        settings = {
          table_name: selectedTable.name,
          view_name: selectedView.name,
          shown_image_name: isImageExist ? shown_image_name : imageColumns[0].name,
          shown_title_name: isTitleExist ? shown_title_name : titleColumns[0].name,
          shown_column_names: []
        };
        const newAppConfig = Object.assign({}, appConfig, {settings});
        this.setState({
          appConfig: newAppConfig,
          isLoading: false
        });
        return;
      }
    }

    this.setState({isLoading: false});
  }

  resetAppConfig = (config) => {
    const { table_name, view_name } = config.settings;

    const tables = this.dtable.getTables();
    const selectedTable = tables.find(table => table.name === table_name);

    const columns = this.dtable.getColumns(selectedTable);
    const imageColumns = getImageColumns(columns);
    const titleColumns = getTitleColumns(this.dtable, columns);

    // change selected table
    if (table_name && !view_name) {
      const views = this.dtable.getViews(selectedTable);
      const selectedView = views[0];

      const settings = {
        table_name: table_name,
        view_name: selectedView.name,
        shown_image_name: imageColumns[0] && imageColumns[0].name,
        shown_title_name: titleColumns[0] && titleColumns[0].name,
        shown_column_names: []
      };
      return Object.assign({}, config, {settings});
    }

    // change selected view
    if (table_name && view_name) {
      const settings = {
        table_name: table_name,
        view_name: view_name,
        shown_image_name: imageColumns[0] && imageColumns[0].name,
        shown_title_name: titleColumns[0] && titleColumns[0].name,
        shown_column_names: []
      };
      return Object.assign({}, config, {settings});
    }

  }

  updateAppConfig = (config, needResetAppConfig) => {
    this.setState({
      isSaving: true,
      isShowSaveMessage: true,
    }, () => {
      let newAppConfig = config;
      if (needResetAppConfig) newAppConfig = this.resetAppConfig(config);
      const workspaceID = context.getSetting('workspaceID');
      const dtableName = context.getSetting('dtableName');
      const appId = context.getSetting('appId');
      dtableWebAPI.updateExternalAppInstance(workspaceID, dtableName, appId, JSON.stringify(newAppConfig)).then(res => {
        this.setState({
          appConfig: newAppConfig,
          isSaving: false,
        }, () => {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.timer = setTimeout(() => {
            this.setState({isShowSaveMessage: false});
          }, 1000);
        });
      }).catch(err => {
        toaster.danger(intl.get('Failed_to_update_app_config'));
        this.setState({
          isSaving: false,
          isShowSaveMessage: false
        });
      });
    });
  }

  render() {
    let { isLoading } = this.state;
    if (isLoading) {
      return <div className="d-flex flex-fill align-items-center"><Loading /></div>;
    }

    const { isSaving, isShowSaveMessage, appConfig } = this.state;
    
    return (
      <Gallery 
        dtable={this.dtable}
        isSaving={isSaving}
        isShowSaveMessage={isShowSaveMessage}
        appConfig={appConfig}
        updateAppConfig={this.updateAppConfig}
      />
    );
  }
}

export default App;
