import React, { Component } from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { generateDefaultUser, getKnownCollaboratorsByEmails } from '../../utils/collaborator-utils';
import context from '../../context';
import eventBus from '../../utils/event-bus';
import { EVENT_BUS_TYPE } from '../constants/event-bus-type';

class LinkCollaboratorItemFormatter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collaborators: []
    };
  }

  componentDidMount() {
    this.initCollaborators(this.props);
    this.queryCollaborators = eventBus.subscribe(EVENT_BUS_TYPE.QUERY_COLLABORATORS, this.loadCollaborators);
    this.queryCollaborator = eventBus.subscribe(EVENT_BUS_TYPE.QUERY_COLLABORATOR, this.loadCollaborator);
  }

  UNSAFE_componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.value !== prevProps.value) {
      this.initCollaborators(nextProps);
    }
  }

  componentWillUnmount() {
    this.queryCollaborators();
    this.queryCollaborator();
  }

  initCollaborators = (props) => {
    const { value } = props;
    if (!value) {
      this.setState({ collaborators: [] });
      return;
    }
    let collaborators = getKnownCollaboratorsByEmails(value);
    if (collaborators.length === 0) {
      this.setState({ collaborators: [] });
      return;
    }
    const queryingCollaborators = collaborators.filter(collaborator => collaborator && !collaborator.loaded);
    const unknownCollaboratorEmails = value.filter((email, index) => !collaborators[index]);
    if (queryingCollaborators.length === 0 && unknownCollaboratorEmails.length === 0) {
      this.setState({ isDataLoaded: true, collaborators: collaborators });
      return;
    }
    if (unknownCollaboratorEmails.length > 0) {
      unknownCollaboratorEmails.forEach(email => {
        const valueTemplate = {
          loaded: false,
          email: value,
          name: value,
        };
        context.updateCollaboratorsCache(email, valueTemplate);
      });
      window.app.queryUsers(unknownCollaboratorEmails, (emailUserMap) => {
        unknownCollaboratorEmails.forEach(email => {
          const collaborator = (emailUserMap && emailUserMap[email]) || { ...generateDefaultUser(email), name: intl.get('Unknown') };
          const loadedCollaborator = { ...collaborator, loaded: true };
          context.updateCollaboratorsCache(email, loadedCollaborator);
        });
        eventBus.dispatch(EVENT_BUS_TYPE.QUERY_COLLABORATORS, unknownCollaboratorEmails);
      });
    }
  }

  loadCollaborators = (unknownCollaboratorEmails) => {
    const { value } = this.props;
    if (!Array.isArray(value) || value.length === 0) return;
    if (!value.find(email => unknownCollaboratorEmails.includes(email))) return;
    const collaborators = getKnownCollaboratorsByEmails(value);
    if (collaborators.every(collaborator => collaborator.loaded)) {
      this.setState({ collaborators });
      return;
    }
  }

  loadCollaborator = (collaboratorEmail) => {
    const { value } = this.props;
    if (!Array.isArray(value) || value.length === 0) return;
    if (!value.find(email => email === collaboratorEmail)) return;
    const collaborators = getKnownCollaboratorsByEmails(value);
    if (collaborators.every(collaborator => collaborator.loaded)) {
      this.setState({ collaborators });
      return;
    }
  }

  render() {
    const { collaborators } = this.state;
    if (!Array.isArray(collaborators) || collaborators.length === 0) return null;

    return (
      <div className="dtable-link-item dtable-link-collaborator-item">
        {collaborators.map(item => item.name).join(', ')}
      </div>
    );
  }
}

LinkCollaboratorItemFormatter.propTypes = {
  value: PropTypes.string,
};

export default LinkCollaboratorItemFormatter;
