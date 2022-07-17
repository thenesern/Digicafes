import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    navbar: {
      color: {
        type: String,
      },
    },
    prices: {
      isActive: {
        type: Boolean,
      },
      price: {
        type: Number,
      },
    },
    capacity: [
      {
        tableSize: {
          type: Number,
        },
        tableQuantity: {
          type: Number,
        },
      },
    ],
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
      tuesday: {
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
      wednesday: {
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
      thursday: {
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
      friday: {
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
      saturday: {
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
