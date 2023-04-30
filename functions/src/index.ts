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

// remove messages older than 1 hour
exports.cleaner = functions.pubsub.schedule('every 1 hours').onRun(async () => {
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;

  const messagesRef = admin.firestore().collection('messages');
  const query = messagesRef.where('createdAt', '<', cutoff);
  const messages = await query.get();

  messages.forEach((snap) => {
    snap.ref.delete();
  });

  return null;
});
