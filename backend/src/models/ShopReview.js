import mongoose from 'mongoose';

const shopReviewSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: '',
      maxlength: 2000
    }
  },
  { timestamps: true }
);

shopReviewSchema.index({ sellerId: 1, createdAt: -1 });

const ShopReview = mongoose.model('ShopReview', shopReviewSchema);
export default ShopReview;
