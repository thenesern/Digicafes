import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      phoneNumber: {
        type: String,
      },
      instagramLink: {
        type: String,
      },
    },
    gallery: {
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
    storeLogo: {
      type: String,
    },
    bookingSchema: {
      stage: {
        type: String,
      },
      columns: {
        type: Number,
      },
      gate: {
        type: String,
      },
      savedColumns: {
        type: Object,
      },
    },
    tableNum: {
      type: Number,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
