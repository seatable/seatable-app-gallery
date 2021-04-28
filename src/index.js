import React from 'react';
import ReactDOM from 'react-dom';
import './setting';
import App from './app';

const viewConfig = {
  _id: '0000',
  name: '你好的',
  settings: {
    table_name: 'Table1',
    view_name: '默认视图',
    shown_title_name: '',
    shown_image_name: '',
    shown_column_names: [],
  }
};

class TaskList {

  static execute() {
    ReactDOM.render(
      <App viewConfig={viewConfig} isDevelopment={true} />,
      document.getElementById('root')
    );
  }

}

TaskList.execute();

window.app = window.app ? window.app : {};
window.app.onClosePlugin = function() {

}

