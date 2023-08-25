
import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commnuity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  parentId: { type: String }, // In case these Thread is a comment

  /*  one thread can have multiple threads as children   multi-level commenting functionality
    Thread Original
        -> Thread Comment1
          -> Thread Comment2
            -> Thread Comment3        */
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],

});

/* Why we are doing in this way?
First time the Mongoose models is not going to exist. So it's going to fall back to
creating a Mongoose modelUser based on the userSchema. 
But every second time we call it, it's already going to have a
mongoose model in the database. So it's going to know to create it of that instance. */
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;