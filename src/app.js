import React from 'react';
import PropTypes from 'prop-types';
import DTable from 'dtable-sdk';
import Gallery from './pages/gallery.js';
import Loading from './common/loading';

import './locale/index.js'

const propTypes = {
  // viewConfig: PropTypes.object.isRequired,
};

const viewConfig = {
  _id: '0000',
  name: '你好的',
  settings: {
    table_name: 'Table1',
    view_name: '默认视图',
    shown_title_name: '',
    shown_image_name: '',
    shown_column_names: [],
  }
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewConfig: viewConfig,
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
    await this.dtable.init(window.dtablePluginConfig);
    await this.dtable.syncWithServer();
    this.dtable.subscribe('dtable-connect', () => { this.onDTableConnect(); });
    this.unsubscribeLocalDtableChanged = this.dtable.subscribe('local-dtable-changed', () => { this.onDTableChanged(); });
    this.unsubscribeRemoteDtableChanged = this.dtable.subscribe('remote-dtable-changed', () => { this.onDTableChanged(); });
    this.resetData();
  }

  onDTableConnect = () => {
    this.resetData();
  }

  onDTableChanged = () => {
    this.resetData();
  }

  resetData = () => {
    this.setState({isLoading: false});
  }

  updateViewConfig = (config) => {
    console.log(config)
  }

  render() {
    let { isLoading } = this.state;
    if (isLoading) {
      return <div className="d-flex flex-fill align-items-center"><Loading /></div>;
    }
    
    return (
      <Gallery 
        dtable={this.dtable}
        viewConfig={viewConfig}
        updateViewConfig={this.updateViewConfig}
      />
    );
  }
}

App.propTypes = propTypes;

export default App;
