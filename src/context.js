import cookie from 'react-cookies';
import DTableWebAPI  from 'dtable-web-api';
import User from './model/user';
import eventBus from './utils/event-bus';

class Context {

  constructor() {
    this.settings = window.dtable ? window.dtable : window.dtablePluginConfig;
    this.api = null;
    this.initApi();
    this.collaboratorsCache = {};
    this.loadCollaboratorMap = {};
  }

  initApi() {
    let dtableWebAPI = new DTableWebAPI();
    if (this.getSetting('isDevelopment')) {
      const server = this.getSetting('server');
      const username = this.getSetting('username');
      const password = this.getSetting('password');
      dtableWebAPI.init({ server, username, password });
      dtableWebAPI.login();
    } else {
      const siteRoot = this.getSetting('siteRoot');
      const xcsrfHeaders = cookie.load('dtable_csrftoken');
      dtableWebAPI.initForDTableUsage({ siteRoot, xcsrfHeaders });
    }
    this.api = dtableWebAPI;
  }

  getCollaborators() {
    if (!this.api) return Promise.reject();
    const dtableName = this.getSetting('dtableName');
    const workspaceID = this.getSetting('workspaceID');
    return this.api.getTableRelatedUsers(workspaceID, dtableName);
  }

  getUserCommonInfo(email, avatar_size) {
    if (!this.api) return Promise.reject();
    return this.api.getUserCommonInfo(email, avatar_size);
  }

  listUserInfo(useList) {
    if (!this.api) return Promise.reject();
    return this.api.listUserInfo(useList);
  }

  loadCollaborator = (email) => {
    if (!email || this.loadCollaboratorMap[email] || this.getCollaboratorFromCache(email)) {
      return;
    }
    this.loadCollaboratorMap[email] = true;
    // send email request on demand
    let collaborator;
    this.getUserCommonInfo(email).then(res => {
      collaborator = res.data;
      this.updateCollaboratorsCache(email, collaborator);
      eventBus.dispatch('collaborators-updated');
    }).catch(() => {
      // If the network request is wrong, use the default avatar
      let mediaUrl = this.getSetting('mediaUrl');
      let defaultAvatarUrl = `${mediaUrl}/avatars/default.png`;
      collaborator = {
        name: email,
        avatar_url: defaultAvatarUrl,
      };
      this.updateCollaboratorsCache(email, collaborator);
      eventBus.dispatch('collaborators-updated');
    });
  }

  getCollaboratorFromCache(email) {
    return this.collaboratorsCache[email];
  }

  getCollaboratorsFromCache() {
    const collaboratorsCache = this.collaboratorsCache;
    return Object.values(collaboratorsCache).filter(item => item.email !== 'anonymous');
  }

  updateCollaboratorsCache(email, collaborator) {
    if (collaborator instanceof User) {
      this.collaboratorsCache[email] = collaborator;
      return;
    }
    this.collaboratorsCache[email] = new User(collaborator);
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

  updateExternalAppInstance(newAppConfig) {
    if (!this.api) return Promise.reject();
    const appId = this.getSetting('appId');
    const dtableName = this.getSetting('dtableName');
    const workspaceID = this.getSetting('workspaceID');
    return this.api.updateExternalAppInstance(workspaceID, dtableName, appId, JSON.stringify(newAppConfig));
  }

  queryUsers(emails, callback) {
    window.app && window.app.queryUsers(emails, callback)
  }

}

const context =  new Context();

export default context;
