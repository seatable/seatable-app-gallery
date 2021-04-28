import React from 'react';
import PropTypes from 'prop-types';
import DTable from 'dtable-sdk';
import context from './context.js';
import Gallery from './pages/gallery.js';
import Loading from './common/loading';

import './locale/index.js'

const propTypes = {
  viewConfig: PropTypes.object.isRequired,
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewConfig: props.viewConfig,
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
    await this.dtable.init(context.getConfig());
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
    this.setState({viewConfig: config}, () => {
      console.log(config);
    });
  }

  render() {
    let { isLoading } = this.state;
    if (isLoading) {
      return <div className="d-flex flex-fill align-items-center"><Loading /></div>;
    }

    const { viewConfig } = this.state;
    
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
