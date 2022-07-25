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
    currency: {
      type: String,
    },
    tableNum: {
      type: Number,
      required: true,
    },
    storeLogo: {
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
        subCategory: {
          type: String,
          unique: true,
        },
        category: [
          {
            type: String,
            required: true,
          },
        ],
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
    createdAt: {
      type: Date,
    },

    calls: [
      {
        tableNum: {
          type: Number,
          required: true,
        },
        callName: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    orders: [
      {
        tableNum: Number,
        createdAt: {
          type: Date,
        },
        orderNotes: {
          type: String,
        },
        cartItems: [
          {
            name: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            img: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const QRMenu2 =
  mongoose.models.QRMenu2 || mongoose.model("QRMenu2", QRMenuSchema);

export default QRMenu2;
