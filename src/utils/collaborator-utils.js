import { isValidEmail } from 'dtable-utils';
import context from '../context';
import User from '../model/user';

export const getMediaUrl = () => {
  return context.getSetting('mediaUrl');
};

export const getKnownCollaboratorByEmail = (email) => {
  const defaultUser = generateDefaultUser(email);
  if (email === 'anonymous' || email === 'Automation Rule') {
    const anonymous = new User({
      ...defaultUser,
      loaded: true,
    });
    context.updateCollaboratorsCache(email, anonymous);
    return anonymous;
  }
  let creator = context.getCollaboratorFromCache(email);
  if (creator) return creator;
  if (!isValidEmail(email)) {
    creator = new User({
      ...defaultUser,
      loaded: true,
    });
    context.updateCollaboratorsCache(email, creator);
    return creator;
  }
  creator = context.getCollaboratorFromCache(email);
  if (creator) return creator;
  return null;
};

export const getKnownCollaboratorsByEmails = (emails) => {
  if (!Array.isArray(emails) || emails.length === 0) return [];
  return emails.map(email => getKnownCollaboratorByEmail(email));
};

export const generateDefaultUser = (name) => {
  const mediaUrl = getMediaUrl();
  const defaultAvatarUrl = `${mediaUrl}avatars/default.png`;
  return {
    name,
    email: name,
    avatar_url: defaultAvatarUrl,
  };
};
