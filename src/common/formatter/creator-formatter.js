import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CollaboratorItem } from 'dtable-ui-component';
import { generateDefaultUser, getKnownCollaboratorByEmail } from '../../utils/collaborator-utils';
import context from '../../context';
import eventBus from '../../utils/event-bus';
import { EVENT_BUS_TYPE } from '../constants/event-bus-type';

class CreatorFormatter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      collaborator: null,
    };
  }

  componentDidMount() {
    this.initCollaborator(this.props);
    this.queryCollaborator = eventBus.subscribe(EVENT_BUS_TYPE.QUERY_COLLABORATOR, this.loadCollaborator);
    this.queryCollaborators = eventBus.subscribe(EVENT_BUS_TYPE.QUERY_COLLABORATORS, this.loadCollaborators);
  }

  UNSAFE_componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.value !== prevProps.value) {
      this.initCollaborator(nextProps);
    }
  }

  componentWillUnmount() {
    this.queryCollaborator();
    this.queryCollaborators();
  }

  initCollaborator = (props) => {
    const { value } = props;
    if (!value) {
      this.setState({ isDataLoaded: true, collaborator: null });
      return;
    }
    let collaborator = getKnownCollaboratorByEmail(value);
    if (collaborator && collaborator.loaded) {
      this.setState({ isDataLoaded: true, collaborator: collaborator });
      return;
    }
    if (!collaborator) {
      const valueTemplate = {
        loaded: false,
        email: value,
        name: value,
      };
      context.updateCollaboratorsCache(value, valueTemplate);
      window.app.queryUsers([ value ], (emailUserMap) => {
        collaborator = (emailUserMap && emailUserMap[value]) || generateDefaultUser(value);
        const loadedCollaborator = { ...collaborator, loaded: true };
        context.updateCollaboratorsCache(value, loadedCollaborator);
        eventBus.dispatch(EVENT_BUS_TYPE.QUERY_COLLABORATOR, value);
      });
    }
  }

  loadCollaborator = (collaboratorEmail) => {
    const { value } = this.props;
    if (value !== collaboratorEmail) return;
    const collaborator = getKnownCollaboratorByEmail(collaboratorEmail);
    this.setState({ isDataLoaded: true, collaborator });
  }

  loadCollaborators = (unknownCollaboratorEmails) => {
    const { value } = this.props;
    if (!unknownCollaboratorEmails.includes(value)) return;
    const collaborator = getKnownCollaboratorByEmail(value);
    this.setState({ isDataLoaded: true, collaborator });
  }

  render() {
    const { isDataLoaded, collaborator } = this.state;
    const { containerClassName } = this.props;
    const formatterClassName = `dtable-ui cell-formatter-container creator-formatter ${containerClassName}`;

    if (!isDataLoaded) {
      return (<div className={formatterClassName}></div>);
    }

    if (!collaborator) {
      return (<div className={formatterClassName}></div>);
    }
    
    return (
      <div className={formatterClassName}>
        <CollaboratorItem collaborator={collaborator} />
      </div>
    );
  }
}

CreatorFormatter.propTypes = {
  containerClassName: PropTypes.string,
  value: PropTypes.string,
};

export default CreatorFormatter;
