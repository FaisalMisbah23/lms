import mongoose, { Document } from "mongoose";

interface faqItems extends Document {
  question: string;
  answer: string;
}

interface Category extends Document {
  title: string;
}

interface BannerImage extends Document {
  public_id: string;
  url: string;
}

interface Layout extends Document {
  type: string;
  faqs: faqItems[];
  categories: Category[];
  bannerImage: {
    image: BannerImage;
    title: string;
    subtitle: string;
  };
}

const faqSchema = new mongoose.Schema<faqItems>({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = new mongoose.Schema<Category>({
  title: { type: String },
});

const bannerImageSchema = new mongoose.Schema<BannerImage>({
  public_id: { type: String },
  url: { type: String },
});

const layoutSchema = new mongoose.Schema<Layout>({
  type: { type: String },
  faqs: [faqSchema],
  categories: [categorySchema],
  bannerImage: {
    image: bannerImageSchema,
    title: { type: String },
    subtitle: { type: String },
  },
});

const Layout: mongoose.Model<Layout> = mongoose.model("Layout", layoutSchema);
export default Layout;
