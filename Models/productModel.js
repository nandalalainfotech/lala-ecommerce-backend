import mongoose from 'mongoose';



const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true,  },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    // image: { type: String, default: false },
    // imageFile: { type: String, default: false },
    fileId: { type: mongoose.Schema.Types.ObjectID, ref: 'Image' },
    brand: { type: String, required: true },
    categorytitle: { type: String, required: true },
    category: { type: String, required: true },
    categorygroup: { type: String, required: true },
    categorytype: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, default: false },
    numReviews: { type: Number, default: false},
    reviews: [reviewSchema],

  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;