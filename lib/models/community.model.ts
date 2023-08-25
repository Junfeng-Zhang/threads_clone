
import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  threads: [ // One user can have multiple references to specific threads stored in DB
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
    }
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

});

/* Why we are doing in this way?
First time the Mongoose models is not going to exist. So it's going to fall back to
creating a Mongoose modelUser based on the communitySchema. 
But every second time we call it, it's already going to have a
mongoose model in the database. So it's going to know to create it of that instance. */
const Community = mongoose.models.Community || mongoose.model('Community', communitySchema);

export default Community;