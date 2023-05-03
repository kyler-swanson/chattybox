# chattybox

**chattybox** is a web application that allows users to chat in real-time with others. It is built using React and Firebase.

## Demo

https://chattybox-c0902.web.app

## Features

**chattybox** lets you join a lively community and interact with others in real-time. Here's what you can do:

- 💬 Instantly send and receive messages with other users, and see them appear on your screen as soon as they're posted.
- ✏️ Edit your messages if you made a typo or want to add more details.
- 🗑️ Delete your messages if you change your mind or want to remove a message from the conversation.
- 💬 Reply to messages to keep the discussion going or ask follow-up questions.
- 👍 React to messages with fun and expressive emoji, to show your mood or agreement.
- 📝 Send messages in Markdown, to add formatting and style to your messages.
- 🌙 Toggle between light and dark mode, to suit your preferences.
- 🥳 Send GIFs using Giphy's API, to add some fun to your messages.
- 🚀 All data is securely stored in Firebase's Firestore database, and user authentication is seamlessly handled by Firebase Authentication. The website is hosted on Firebase Hosting, ensuring a fast and reliable experience for all users.

## Technologies Used

**chattybox** is built using the following technologies:

- React
- Firebase (Firestore, Cloud Functions, Authentication, Hosting)
  - Cloud Functions are used to moderate messages, ensuring that they are appropriate for all users.s
- Radix UI Primitives
- Tailwind CSS

## Getting Started

To get started with **chattybox**, you'll need to do the following:

Clone the repository to your local machine:

```bash
git clone https://github.com/kyler-swanson/chattybox.git
```

Install the required dependencies:

```bash
npm install
```

Copy the `.env` file to `.env.local` and fill in the required environment variables:

```bash
cp .env .env.local
```

Start the development server:

```bash
npm start
```

Login using your Google Account to join the conversation and start chatting. 🎉

## Deployment

The application is automatically built and deployed to Firebase Hosting using GitHub Actions. Whenever a new commit is pushed to the main branch, the GitHub Actions workflow will be triggered, building the application and deploying it to Firebase Hosting.

## Contributions

Contributions to **chattybox** are always welcome! If you have any suggestions, bug reports, or feature requests, please open an issue on this repository.

If you'd like to contribute code to **chattybox**, please fork this repository and submit a pull request with your changes. All contributions must adhere to our code of conduct.

## License

**chattybox** is released under the MIT License. See [LICENSE.md](https://github.com/kyler-swanson/chattybox/blob/main/LICENSE.md) for details.
