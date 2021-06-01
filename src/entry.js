import React from 'react';
import ReactDOM from 'react-dom';
import './setting.prod';

import App from './app'

class TaskList {

  static execute() {
    let wrapper = document.querySelector('#wrapper');
    ReactDOM.render(<App />, wrapper);
  }

}

TaskList.execute();