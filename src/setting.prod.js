const { mediaUrl, serviceURL: server, siteRoot } = window.app.config;
const { workspaceID, dtableUuid, dtableName, appId, appType, appConfig, accessToken, dtableServer, isEditAppPage } = window.shared.pageOptions;

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
  appId: appId,
  appType: appType,
  appConfig: appConfig,
  isEditAppPage
};
