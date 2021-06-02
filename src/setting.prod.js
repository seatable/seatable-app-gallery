const { mediaUrl, serviceURL: server, siteRoot } = window.app.config;
const { workspaceID, dtableUuid, dtableName, appId, appType, token, appConfig, accessToken, dtableServer, isEditAppPage } = window.shared.pageOptions;

window.dtable = {
  mediaUrl,
  workspaceID,
  dtableUuid,
  dtableName,
  accessToken,
  siteRoot,
  server,
  dtableServer,
  dtableSocket: dtableServer,
  appId,
  appType,
  appToken: token,
  appConfig,
  isEditAppPage
};
