const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
    "commentId": "string",        // Unique identifier for the comment
    "postId": "string",           // Identifier of the post to which the comment belongs
    "userId": "string",           // Identifier of the user who made the comment
    "username": "string",         // Username of the user who made the comment
    "content": "string",          // Text content of the comment
    "timestamp": "timestamp",      // Date and time when the comment was created
    "likes": "number",            // Number of likes the comment has received
    "replies": [
      // Array of reply comments (nested comments)
      {
        "commentId": "string",
        "userId": "string",
        "username": "string",
        "content": "string",
        "timestamp": "timestamp",
        "likes": "number"
        // ... additional fields for replies
      },
      // ... additional replies
    ],
    // ... additional fields for the main comment
  }
  )

  const Comment = mongoose.model('Comment',commentSchema);
  module.exports = Comment;