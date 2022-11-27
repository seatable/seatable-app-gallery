import GalleryAPI from "../api/gallery-api";
import * as CellType from '../common/constants/cell-types';
import COLUMNS_ICON_CONFIG from '../common/constants/column-icon';
import { SELECT_OPTION_COLORS } from "../common/constants/select-option-colors";
import { getImageColumns, getTitleColumns } from "./utils";

class DTableUtils {

  constructor(config) {
    this.config = config;
    this.galleryAPI = new GalleryAPI(config);
    this.tables = [];
    this.views = [];
    this.columns = [];
    this.rows = [];
    this.relatedUsers = [];

    this.selectedTable = null;
    this.selectedView = null;
  }

  async init(appConfig) {
    const { isEditAppPage } = this.config;
    if (isEditAppPage) {
      const res = await this.galleryAPI.getDTableMetadata();
      const metadata = res.data.metadata;
      this.tables = metadata.tables;
    } else {
      const { table_name, view_name } = appConfig.settings;
      this.columns = this.listColumns(table_name, view_name);
      this.rows = await this.listRows(table_name, view_name);
    }
    const res = await this.galleryAPI.getRelatedUsers();
    this.relatedUsers = res.data.user_list;
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
    const { table_name, view_name, shown_image_name, shown_title_name, shown_column_names, display_field_name } = appConfig.settings;

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
      settings = {
        table_name: selectedTable.name,
        view_name: selectedView.name,
        shown_image_name: imageColumns[0] && imageColumns[0].name,
        shown_title_name: titleColumns[0] && titleColumns[0].name,
        shown_column_names: [],
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

    // selected view has been deleted in original base's table
    if (!selectedView) {
      selectedView = selectedTable.views[0];
      settings = {
        table_name: selectedTable.name,
        view_name: selectedView.name,
        shown_image_name: imageColumns[0] && imageColumns[0].name,
        shown_title_name: titleColumns[0] && titleColumns[0].name,
        shown_column_names: [],
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
      shown_column_names: []
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
      shown_column_names: []
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
    return this.views;
  }

  getColumns() {
    return this.columns;
  }

  getRows() {
    return this.rows;
  }

  getCellType() {
    return CellType;
  }

  getRelatedUsers() {
    return this.relatedUsers;
  }

  getColumnIconConfig() {
    return COLUMNS_ICON_CONFIG;
  }

  getOptionColors = () => {
    return SELECT_OPTION_COLORS;
  }

}

export default DTableUtils;
