import React from 'react';
import intl from 'react-intl-universal';
import context from './context.js';
import Gallery from './pages/gallery.js';
import Loading from './common/loading';
import toaster from './common/toaster';
import { isEditAppPage } from './utils/utils.js';
import DTableUtils from './utils/dtable-utils.js';

import './locale/index.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    const appConfig = context.getSetting('appConfig');
    this.state = {
      isLoading: true,
      appConfig: JSON.parse(appConfig),
      isSaving: false,
      isShowSaveMessage: false,
    };
    this.dtable = new DTableUtils(context.getConfig());
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  componentWillUnmount() {
    this.unsubscribeLocalDtableChanged();
    this.unsubscribeRemoteDtableChanged();
  }

  async initPluginDTableData() {
    try {
      const { appConfig } = this.state;
      await this.dtable.init(appConfig);
      if (isEditAppPage()) {
        const newConfig = await this.dtable.getConfig(appConfig);

        const tables = this.dtable.getTables();
        const views = this.dtable.getViews();
        const columns = this.dtable.getColumns();
        const rows = this.dtable.getRows();
        this.setState({
          tables,
          views,
          columns,
          rows,
          isLoading: false,
          appConfig: newConfig
        })
      } else {
        const columns = this.dtable.getColumns();
        const rows = this.dtable.getRows();
        this.setState({
          columns,
          rows,
          isLoading: false
        });
      }
    } catch(err) {
      // if (isEditAppPage()) {
      //   this.setState({
      //     isLoading: false,
      //     errorMessage: ''
      //   })
      // }
      console.log(err);
    }
  }

  onDTableConnect = () => {
    this.resetData();
  }

  onDTableChanged = () => {
    this.resetData();
  }

  updateAppConfig = async (config, type = null) => {
    this.setState({
      isSaving: true,
      isShowSaveMessage: true,
    });
    let newAppConfig = config;
    if (type && type === 'table') {
      newAppConfig = await this.dtable.getConfigByChangeSelectedTable(config);
    }
    if (type && type === 'view') {
      newAppConfig = await this.dtable.getConfigByChangeSelectedView(config);
    }
    context.updateExternalAppInstance(newAppConfig).then(res => {
      const views = this.dtable.getViews();
      const columns = this.dtable.getColumns();
      const rows = this.dtable.getRows();
      this.setState({
        appConfig: newAppConfig,
        isSaving: false,
        views,
        columns,
        rows
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
  }

  render() {
    let { isLoading } = this.state;
    if (isLoading) {
      return <div className="d-flex flex-fill align-items-center"><Loading /></div>;
    }

    const { isSaving, isShowSaveMessage, appConfig } = this.state;
    
    return (
      <Gallery 
        isSaving={isSaving}
        isShowSaveMessage={isShowSaveMessage}
        dtable={this.dtable}
        tables={this.state.tables}
        views={this.state.views}
        columns={this.state.columns}
        rows={this.state.rows}
        appConfig={appConfig}
        updateAppConfig={this.updateAppConfig}
      />
    );
  }
}

export default App;
