import mongoose from 'mongoose';

const sellerFollowSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

sellerFollowSchema.index({ followerId: 1, sellerId: 1 }, { unique: true });

const SellerFollow = mongoose.model('SellerFollow', sellerFollowSchema);
export default SellerFollow;
