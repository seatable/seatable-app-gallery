const { mediaUrl, serviceURL: server, siteRoot } = window.app.config;
const { workspaceID, dtableUuid, dtableName, appType, appConfig, accessToken, dtableServer } = window.shared.pageOptions;

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
  appName: appType,
  appConfig: appConfig,
};
