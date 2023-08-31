import {
  COLUMNS_ICON_CONFIG,
  SELECT_OPTION_COLORS,
} from 'dtable-utils';
import GalleryAPI from "../api/gallery-api";
import { getImageColumns, getTitleColumns } from "./utils";
import context from '../context';

class DTableUtils {

  constructor(config) {
    this.config = config;
    this.galleryAPI = new GalleryAPI(config);
    this.tables = [];
    this.views = [];
    this.columns = [];
    this.rows = [];

    this.selectedTable = null;
    this.selectedView = null;
  }

  async init(appConfig) {
    const { isEditAppPage, columns } = this.config;
    if (isEditAppPage) {
      const res = await this.galleryAPI.getDTableMetadata();
      const metadata = res.data.metadata;
      this.tables = metadata.tables;
    } else {
      const { table_name, view_name } = appConfig.settings;
      this.columns = JSON.parse(columns);
      this.rows = await this.listRows(table_name, view_name);
    }

    // Edit APP page, load all collaborators for page setting in app.js
    // Preview APP page, load collaborator on demand
    if (isEditAppPage) {
      const res = await context.getCollaborators();
      const { app_user_list, user_list } = res.data;
      app_user_list.forEach(user => {
        context.updateCollaboratorsCache(user.email, Object.assign({}, user, {loaded: true}));
      });
      user_list.forEach(user => {
        context.updateCollaboratorsCache(user.email, Object.assign({}, user, {loaded: true}));
      });
    }
  }
  
  listColumns(tableName, viewName) {
    const table = this.tables.find(table => table.name === tableName);
    if (!table) return [];
    const view = table.views.find(view => view.name === viewName);
    if (!view) return table.columns;
    const columns = table.columns.filter(col => !(view.hidden_columns || []).find(hColKey => col.key === hColKey));
    return columns;
  }

  async listRows(tableName, viewName) {
    const res = await this.galleryAPI.listRows(tableName, viewName);
    return res.data.rows;
  }

  async getConfig(appConfig) {
    const { table_name, view_name, shown_image_name, shown_title_name, shown_column_names, display_field_name, fields_key } = appConfig.settings;

    let settings = null;
    let selectedTable = null;
    let selectedView = null;
    let columns = [];
    let imageColumns = [];
    let titleColumns = [];

    const tables = this.tables;
    selectedTable = tables.find(table => table.name === table_name);
    // 1. first visit edit app view
    // 2. selected table has been deleted in original base
    if (!table_name || !selectedTable) {
      selectedTable = tables[0];
      selectedView = selectedTable.views[0];
      columns = selectedTable.columns.filter(col => {
        if (!selectedView.hidden_columns || selectedView.hidden_columns.length === 0) return true;
        return !selectedView.hidden_columns.find(colKey => colKey === col.key);
      });
      imageColumns = getImageColumns(columns);
      titleColumns = getTitleColumns(this, columns);
      const fieldsKey = columns.filter(column => column.key !== titleColumns[0].key).map(column => column.key);
      settings = {
        table_name: selectedTable.name,
        view_name: selectedView.name,
        shown_image_name: imageColumns[0] && imageColumns[0].name,
        shown_title_name: titleColumns[0] && titleColumns[0].name,
        shown_column_names: [],
        fields_key: fieldsKey,
        display_field_name: false
      };

      this.views = selectedTable.views;
      this.columns = columns;
      this.rows = await this.listRows(selectedTable.name, selectedView.name);

      this.selectedTable = selectedTable;
      this.selectedView = selectedView;
      return Object.assign({}, appConfig, {settings});
    }

    columns = selectedTable.columns;
    imageColumns = getImageColumns(columns);
    titleColumns = getTitleColumns(this, columns);
    selectedView = selectedTable.views.find(view => view.name === view_name);
    const fieldsKey = columns.filter(column => column.key !== titleColumns[0].key).map(column => column.key);

    // selected view has been deleted in original base's table
    if (!selectedView) {
      selectedView = selectedTable.views[0];
      settings = {
        table_name: selectedTable.name,
        view_name: selectedView.name,
        shown_image_name: imageColumns[0] && imageColumns[0].name,
        shown_title_name: titleColumns[0] && titleColumns[0].name,
        shown_column_names: [],
        fields_key: fieldsKey,
        display_field_name: false
      };

      this.views = selectedTable.views;
      this.columns = columns.filter(col => {
        if (!selectedView.hidden_columns || selectedView.hidden_columns.length === 0) return true;
        return !selectedView.hidden_columns.find(colKey => colKey === col.key);
      });
      this.rows = await this.listRows(selectedTable.name, selectedView.name);

      this.selectedTable = selectedTable;
      this.selectedView = selectedView;
      return Object.assign({}, appConfig, {settings});
    }

    const isImageExist = imageColumns.find(column => column.name === shown_image_name);
    const isTitleExist = titleColumns.find(column => column.name === shown_title_name);
    settings = {
      table_name: selectedTable.name,
      view_name: selectedView.name,
      shown_image_name: isImageExist ? shown_image_name : (imageColumns[0] && imageColumns[0].name),
      shown_title_name: isTitleExist ? shown_title_name : (titleColumns[0] && titleColumns[0].name),
      shown_column_names: shown_column_names,
      fields_key: fields_key,
      display_field_name: !!display_field_name
    };

    this.views = selectedTable.views;
    this.columns = columns.filter(col => {
      if (!selectedView.hidden_columns || selectedView.hidden_columns.length === 0) return true;
      return !selectedView.hidden_columns.find(colKey => colKey === col.key);
    });;
    this.rows = await this.listRows(selectedTable.name, selectedView.name);

    this.selectedTable = selectedTable;
    this.selectedView = selectedView;
    return Object.assign({}, appConfig, {settings});
  }

  async getConfigByChangeSelectedTable(appConfig) {
    const { table_name } = appConfig.settings;
    const selectedTable = this.tables.find(table => table.name === table_name);
    const selectedView = selectedTable.views[0];
    const columns = selectedTable.columns;
    const imageColumns = getImageColumns(columns);
    const titleColumns = getTitleColumns(this, columns);
    const settings = {
      table_name: selectedTable.name,
      view_name: selectedView.name,
      shown_image_name: imageColumns[0] && imageColumns[0].name,
      shown_title_name: titleColumns[0] && titleColumns[0].name,
      shown_column_names: [],
      fields_key: [],
    }

    this.views = selectedTable.views;
    this.columns = columns.filter(col => {
      if (!selectedView.hidden_columns || selectedView.hidden_columns.length === 0) return true;
      return !selectedView.hidden_columns.find(colKey => colKey === col.key);
    });
    this.rows = await this.listRows(selectedTable.name, selectedView.name);

    this.selectedTable = selectedTable;
    this.selectedView = selectedView;
    return Object.assign({}, appConfig, {settings});
  }

  async getConfigByChangeSelectedView(appConfig) {
    const { view_name } = appConfig.settings;
    const selectedView = this.views.find(view => view.name === view_name);
    let columns = this.selectedTable.columns;
    const imageColumns = getImageColumns(columns);
    const titleColumns = getTitleColumns(this, columns);
    const settings = {
      table_name: this.selectedTable.name,
      view_name: selectedView.name,
      shown_image_name: imageColumns[0] && imageColumns[0].name,
      shown_title_name: titleColumns[0] && titleColumns[0].name,
      shown_column_names: [],
      fields_key: [],
    }
    const { hidden_columns } = selectedView;
    if (hidden_columns && Array.isArray(hidden_columns) && hidden_columns.length > 0) {
      columns = columns.filter(col => !hidden_columns.find(colKey => colKey === col.key));
    }
    this.columns = columns;
    this.rows = await this.listRows(this.selectedTable.name, selectedView.name);

    this.selectedView = selectedView;
    return Object.assign({}, appConfig, {settings});
  }

  getTables() {
    return this.tables;
  }
  
  getViews() {
    return this.views.filter(view => !view['private_for']);
  }

  getColumns() {
    return this.columns;
  }

  getRows() {
    return this.rows;
  }

  getColumnIconConfig() {
    return COLUMNS_ICON_CONFIG;
  }

  getOptionColors = () => {
    return SELECT_OPTION_COLORS;
  }

}

export default DTableUtils;
