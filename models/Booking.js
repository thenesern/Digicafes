import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    navbar: {
      color: {
        type: String,
      },
    },
    subMerchantKey: {
      type: String,
      required: true,
    },
    prices: {
      isActive: {
        type: Boolean,
      },
      price: {
        type: Number,
      },
    },
    bookings: [
      {
        createdAt: {
          type: Date,
        },
        date: {
          type: String,
        },
        people: {
          type: Number,
        },
        userName: {
          type: String,
        },
        userEmail: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        isPaid: {
          type: Boolean,
        },
      },
    ],

    workingTimes: {
      monday: {
        isActive: {
          type: Boolean,
          default: true,
        },
        workingHours: {
          starts: {
            type: String,
            default: "09:00",
          },
          ends: {
            type: String,
            default: "24:00",
          },
        },
      },
      tuesday: {
        isActive: {
          type: Boolean,
          default: true,
        },
        workingHours: {
          starts: {
            type: String,
            default: "09:00",
          },
          ends: {
            type: String,
            default: "24:00",
          },
        },
      },
      wednesday: {
        isActive: {
          type: Boolean,
          default: true,
        },
        workingHours: {
          starts: {
            type: String,
            default: "09:00",
          },
          ends: {
            type: String,
            default: "24:00",
          },
        },
      },
      thursday: {
        isActive: {
          type: Boolean,
          default: true,
        },
        workingHours: {
          starts: {
            type: String,
            default: "09:00",
          },
          ends: {
            type: String,
            default: "24:00",
          },
        },
      },
      friday: {
        isActive: {
          type: Boolean,
          default: true,
        },
        workingHours: {
          starts: {
            type: String,
            default: "09:00",
          },
          ends: {
            type: String,
            default: "24:00",
          },
        },
      },
      saturday: {
        isActive: {
          type: Boolean,
          default: true,
        },
        workingHours: {
          starts: {
            type: String,
            default: "09:00",
          },
          ends: {
            type: String,
            default: "24:00",
          },
        },
      },
      sunday: {
        isActive: {
          type: Boolean,
          default: false,
        },
        workingHours: {
          starts: {
            type: String,
          },
          ends: {
            type: String,
          },
        },
      },
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
    capacity: {
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
