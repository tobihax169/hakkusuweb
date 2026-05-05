import mongoose from 'mongoose';

const shopMessageSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    body: {
      type: String,
      required: true,
      maxlength: 4000,
      trim: true
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

shopMessageSchema.index({ sellerId: 1, buyerId: 1, createdAt: 1 });

const ShopMessage = mongoose.model('ShopMessage', shopMessageSchema);
export default ShopMessage;
