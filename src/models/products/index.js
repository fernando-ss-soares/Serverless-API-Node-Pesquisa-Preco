import mongoose from "mongoose";

const Product = mongoose.model('Product', {
    Title: String,
    Price: String,
    Buy: String,
    DateSearch: String
});

export default Product;