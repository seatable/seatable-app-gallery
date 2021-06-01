
import intl from 'react-intl-universal';

/** (1/5) initialize config object */
let config = {
  isDevelopment: true,
  username: '',
  password: '',
  lang: "zh-cn",
  siteRoot: '/',
  server: "http://127.0.0.1:80",
  dtableServer: "http://127.0.0.1:5000",
  dtableSocket: "http://127.0.0.1:5000",
  dtableUuid: "84c80017-510d-4afe-afe4-6918d2dd3d9e",
  accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjI1NDAwMTIsImR0YWJsZV91dWlkIjoiODRjODAwMTctNTEwZC00YWZlLWFmZTQtNjkxOGQyZGQzZDllIiwidXNlcm5hbWUiOiJlOWY3NWFmNDBhYjk0NjZlOGQ0YmYxMDIyZTNkYWRiYUBhdXRoLmxvY2FsIiwicGVybWlzc2lvbiI6InJ3In0.ObXm_fBLWM0e6q5BfzWaW62_2-sPkls8gJaEEWj6tAo",
  workspaceID: "1",
  dtableName: "test-1",
  appConfig:"{\"id\":12,\"name\":\"你好的\",\"settings\":{\"table_name\":\"Table1\",\"view_name\":\"默认视图\",\"shown_title_name\":\"\",\"shown_image_name\":\"\",\"shown_column_names\":[]}}",
  isEditAppPage: true,
};

/** (2/5) load local development settings ./setting.local.js (if exist) */
try {
  config.local = require('./setting.local.js').default || {};
  config = {...config, ...{loadVerbose: true}, ...config.local};
  config.loadVerbose && console.log('[SeaTable Plugin Development] Configuration merged with "./src/setting.local.js" (this message can be disabled by adding `loadVerbose: false` to the local development settings)');
  delete config.local;
  delete config.loadVerbose;
} catch (error) {
  // fall-through by intention
  console.error('[SeaTable Plugin Development] Please create "./src/setting.local.js" (from `setting.local.dist.js`)');
  throw error;
}

/** (3/5) remove server trailing slash(es) (if any, common configuration error)*/
if (config.server !== config.server.replace(/\/+$/, '')) {
  console.log(`[SeaTable Plugin Development] Server "${config.server}" trailing slash(es) removed (this message will go away by correcting the \`server: ...\` entry in the local development settings)`);
  config.server = config.server.replace(/\/+$/, '');
}

/** (4/5) set locale for ReactIntlUniversal */
if (intl.options && intl.options.locales && intl.options.locales[config.lang]) {
  intl.options.currentLocale = config.lang;
} else {
  console.warn(`[SeaTable Plugin Development] Locale "${config.lang}" not available`);
  console.info(`[SeaTable Plugin Development] Available locales are: "${Object.keys((intl && intl.options && intl.options.locales) || {'ReactIntlUniversal Loading Error': 1}).join('", "')}"`);
  console.info('[SeaTable Plugin Development] Suggestions: verify "./src/setting.local.js" and/or the locales in "./src/locale"');
}

/* (5/5) init window.dtablePluginConfig  */
window.dtablePluginConfig = config;
