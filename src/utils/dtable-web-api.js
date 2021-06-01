import cookie from 'react-cookies';
import DTableWebAPI  from '../dtable-web-api';
import context from '../context';

let dtableWebAPI = new DTableWebAPI();
if (context.getSetting('isDevelopment')) {
  const server = context.getSetting('server');
  const username = context.getSetting('username');
  const password = context.getSetting('password');
  dtableWebAPI.init({ server, username, password });
  dtableWebAPI.login();
} else {
  const siteRoot = context.getSetting('siteRoot');
  const xcsrfHeaders = cookie.load('dtable_csrftoken');
  dtableWebAPI.initForDTableUsage({ siteRoot, xcsrfHeaders });
}

export { dtableWebAPI };
