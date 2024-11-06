import mongoose from 'mongoose';

const hrSchema = new mongoose.Schema({
  username: { type: String, required: true },
  key: { type: String, required: true },
});


// Export the model
const HRUser= mongoose.models.HRUser || mongoose.model('HRUser', hrSchema);
export default HRUser;
