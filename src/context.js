class Context {

  constructor() {
    this.settings = window.dtable ? window.dtable : window.dtablePluginConfig;
    this.api = window.dtableWebAPI ? window.dtableWebAPI : null;
  }

  getConfig() {
    return this.settings;
  }

  getSetting(key) {
    if (this.settings[key] === false) return this.settings[key];
    return this.settings[key] || '';
  }

  getInitData() {
    return window.app && window.app.dtableStore;
  }

  expandRow(row, table) {
    window.app && window.app.expandRow(row, table);
  }

  closePlugin() {
    window.app && window.app.onClosePlugin();
  }

  getUserCommonInfo(email, avatar_size) {
    if (!this.api) return Promise.reject();
    return this.api.getUserCommonInfo(email, avatar_size);
  }

}

const context =  new Context();

export default context;