import mongoose from 'mongoose';

const ItemCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemGroup',
    required: true,
  },
},
{ 
  timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 } // Adding 5.5 hours for IST
});

export default mongoose.models.ItemCategory || mongoose.model('ItemCategory', ItemCategorySchema);
