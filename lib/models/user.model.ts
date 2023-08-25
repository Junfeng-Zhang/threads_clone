
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [ // One user can have multiple references to specific threads stored in DB
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
    }
  ],
  /* Once we create an account, we have to go through the onboarding 
  where we choose our profile photo bio and username
  */
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [ // one user can belong to many communities, and a community again is Type
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community', // Reference to a Community instance stored in DB
    }
  ]
});

/* Why we are doing in this way?
First time the Mongoose models is not going to exist. So it's going to fall back to
creating a Mongoose modelUser based on the userSchema. 
But every second time we call it, it's already going to have a
mongoose model in the database. So it's going to know to create it of that instance. */
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;