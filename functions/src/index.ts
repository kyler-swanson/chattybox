import BadWordsFilter = require('bad-words');
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const filter = new BadWordsFilter({ placeHolder: 'x' });
admin.initializeApp(functions.config().firebase);

// cloud function to filter profanity
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

exports.updateModifiedReplies = functions.firestore.document('/messages/{messageId}').onUpdate((change) => {
  const before = change.before.data();
  const after = change.after.data();

  if (before?.message !== after?.message) {
    const messagesRef = admin.firestore().collection('messages');
    const query = messagesRef.where('repliesTo.id', '==', before?.id);
    return query.get().then((messages) => {
      messages.forEach((snap) => {
        snap.ref.update({
          'repliesTo.message': '(edited)'
        });
      });
    });
  }

  return null;
});

exports.updateDeletedReplies = functions.firestore.document('/messages/{messageId}').onDelete((change) => {
  const data = change.data();

  const messagesRef = admin.firestore().collection('messages');
  const query = messagesRef.where('repliesTo.id', '==', data.id);
  return query.get().then((messages) => {
    messages.forEach((snap) => {
      snap.ref.update({
        'repliesTo.message': '(deleted)'
      });
    });
  });
});

// remove messages older than 1 hour
exports.cleaner = functions.pubsub.schedule('0 * * * *').onRun(async () => {
  console.log('running');
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;

  const messagesRef = admin.firestore().collection('messages');
  const query = messagesRef.where('createdAt', '<', cutoff);
  const messages = await query.get();

  console.log('query done');

  messages.forEach(async (snap) => {
    console.log(snap);
    await snap.ref.delete();
  });

  return null;
});
