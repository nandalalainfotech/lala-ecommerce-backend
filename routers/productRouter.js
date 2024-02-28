import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../Models/productModel.js';
import { isAdmin, isAuth, isSeller, isSellerOrAdmin } from '../utils.js';
import User from '../Models/userModel.js';
import Image from '../Models/imagesModel.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = null;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const seller = req.query.seller || '';
    const category = req.query.category || '';
    const categorygroup = req.query.categorygroup || '';
    const categorytype = req.query.categorytype || '';
    const categorytitle = req.query.categorytitle || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const categorygroupFilter = categorygroup ? { categorygroup } : {};
    const categorytypeFilter = categorytype ? { categorytype } : {};
    const categorytitleFilter = categorytitle ? { categorytitle } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.count({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...categorygroupFilter,
      ...categorytypeFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    // const products = await Product.find({ ...sellerFilter });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...categorygroupFilter,
      ...categorytypeFilter,
      ...categorytitle,
      ...priceFilter,
      ...ratingFilter,
      fileId: { $ne: null },
    })
      .populate('seller', 'seller.name seller.logo')
      //     .sort(sortOrder);
      //   res.send(products);
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  '/menList',
  expressAsyncHandler(async (req, res) => {
    const menProducts = await Product.find({
      category: 'men',
      fileId: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(10);
    if (menProducts) {
      res.send(menProducts);
    } else {
      res.status(404).send({ message: 'Men Product Not Found' });
    }
  })
);

productRouter.get(
  '/womenList',
  expressAsyncHandler(async (req, res) => {
    const womenProducts = await Product.find({
      category: 'women',
      fileId: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(10);
    if (womenProducts) {
      res.send(womenProducts);
    } else {
      res.status(404).send({ message: 'Women Product Not Found' });
    }
  })
);

productRouter.get(
  '/kidsList',
  expressAsyncHandler(async (req, res) => {
    const kidProducts = await Product.find({
      category: 'kids',
      fileId: { $ne: null },
    }).limit(10);
    if (kidProducts) {
      res.send(kidProducts);
    } else {
      res.status(404).send({ message: 'Kids Product Not Found' });
    }
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);
productRouter.get(
  '/categorygroup',
  expressAsyncHandler(async (req, res) => {
    const categorygroup = await Product.find().distinct('categorygroup');
    res.send(categorygroup);
  })
);
productRouter.get(
  '/categorytype',
  expressAsyncHandler(async (req, res) => {
    const categorytype = await Product.find().distinct('categorytype');
    res.send(categorytype);
  })
);
productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    await Product.remove({});
    // const createdProducts = await Product.insertMany(data.products);
    // res.send({ createdProducts });
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: 'No seller found. first run /api/users/seed' });
    }
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    // const product = await Product.findById(req.params.id);

    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/',
  isAuth,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: req.body.name,
      seller: req.user._id,
      // image: req.body.image,
      // fileId: req.body.imageId,
      price: req.body.price,
      category: req.body.category,
      categorygroup: req.body.categorygroup,
      categorytype: req.body.categorytype,
      categorytitle: req.body.categorytitel,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      // rating: 0,
      // numReviews: 0,
      description: req.body.description,
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.fileId = req.body.fileId;
      // product.image = req.body.image;
      product.category = req.body.category;
      product.categorygroup = req.body.categorygroup;
      product.categorytype = req.body.categorytype;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const image = await Image.findById(product.fileId);
      if (image) {
        const deleteImage = await image.remove();
      }
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
