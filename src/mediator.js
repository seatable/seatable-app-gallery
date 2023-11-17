const { mediaUrl, serviceURL: server, siteRoot, lang } = window.app.config;
const { workspaceID, dtableUuid, dtableName, appId, appType, appUuid
  , appConfig, accessToken, dtableServer, isEditAppPage, columns } = window.shared.pageOptions;

window.dtable = {
  lang,
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
  appUuid,
  appConfig,
  isEditAppPage,
  columns
};
