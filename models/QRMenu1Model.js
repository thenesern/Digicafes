import mongoose from "mongoose";

const QRMenuSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    storeLinkName: {
      type: String,
      required: true,
      unique: true,
    },
    listType: {
      type: String,
      required: true,
    },
    ratings: [
      {
        taste: Number,
        speed: Number,
        service: Number,
        note: String,
      },
    ],
    storeLogo: {
      type: String,
    },
    currency: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: false,
        },
        category: [
          {
            type: String,
            required: true,
          },
        ],
        subCategory: {
          type: String,
          unique: true,
        },
        image: {
          type: String,
          required: false,
        },
      },
    ],
    gallery: {
      name: {
        type: String,
      },
      isActive: {
        type: Boolean,
      },
      galleryImage: {
        type: String,
      },
      images: [
        {
          image: {
            type: String,
          },
        },
      ],
    },
    categories: [
      {
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          unique: true,
        },
      },
    ],
    createdAt: Date,
  },
  { timestamps: true }
);

const QRMenu1 =
  mongoose.models.QRMenu1 || mongoose.model("QRMenu1", QRMenuSchema);

export default QRMenu1;
