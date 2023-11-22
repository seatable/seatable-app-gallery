import axios from 'axios';

class GalleryAPI {

  constructor(config) {
    const { server, dtableUuid, accessToken, lang, appUuid } = config;
    this.dtableUuid = dtableUuid;
    this.lang = lang;
    this.appUuid = appUuid;
    this.req = axios.create({
      baseURL: server,
      headers: {Authorization: 'Token ' + accessToken}
    });
  }

  getDTableMetadata() {
    const url = `/api/v2.1/dtable-apps/gallery/${this.appUuid}/metadata/`;
    return this.req.get(url);
  }

  listRows(tableName, viewName) {
    const url = `/api/v2.1/dtable-apps/gallery/${this.appUuid}/rows/`;
    const params = {
      table_name: tableName,
      view_name: viewName
    }
    return this.req.get(url, {params});
  }

}

export default GalleryAPI;
