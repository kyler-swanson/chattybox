import BadWordsFilter = require('bad-words');
import * as functions from 'firebase-functions';

const filter = new BadWordsFilter();

exports.moderator = functions.database.ref('/messages/{messageId}').onWrite((change) => {
  const message = change.after.val().message;

  if (message && containsProfanity(message)) {
    return change.after.ref.update({ text: filterProfanity(message) });
  }

  return null;
});

const containsProfanity = (text: string) => {
  return filter.isProfane(text);
};

const filterProfanity = (text: string) => {
  return filter.clean(text);
};
