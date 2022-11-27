import axios from 'axios';

class GalleryAPI {

  constructor(config) {
    const { server, dtableUuid, accessToken, lang, appToken } = config;
    this.dtableUuid = dtableUuid;
    this.lang = lang;
    this.appToken = appToken;
    this.req = axios.create({
      baseURL: server,
      headers: {Authorization: 'Token ' + accessToken}
    });
  }

  getDTableMetadata() {
    const url = `/api/v2.1/dtable-apps/gallery/${this.appToken}/metadata/`;
    return this.req.get(url);
  }
  
  getRelatedUsers() {
    const url = `/api/v2.1/dtable-apps/gallery/${this.appToken}/related-users/`;
    return this.req.get(url);
  }

  listRows(tableName, viewName) {
    const url = `/api/v2.1/dtable-apps/gallery/${this.appToken}/rows/`;
    const params = {
      table_name: tableName,
      view_name: viewName
    }
    return this.req.get(url, {params});
  }

}

export default GalleryAPI;
