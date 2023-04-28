import BadWordsFilter = require('bad-words');
import * as functions from 'firebase-functions';

const filter = new BadWordsFilter();

exports.moderator = functions.firestore.document('/messages/{messageId}').onWrite((change) => {
  const snap = change.after;

  if (!snap.exists) {
    return null;
  }

  const message = snap.data()?.message;

  if (message && containsProfanity(message)) {
    return snap.ref.update({
      message: filterProfanity(message)
    });
  }

  return null;
});

const containsProfanity = (text: string) => {
  return filter.isProfane(text);
};

const filterProfanity = (text: string) => {
  return filter.clean(text);
};
