import mongoose from "mongoose";

const TranslatedText = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: TranslatedText, required: true },
    description: { type: TranslatedText, required: true },
    category: {
      type: TranslatedText,
      default: { en: "General", ar: "عام" },
    },
    venue: { type: TranslatedText, required: true },

    tags: [TranslatedText],

    eventDate: { type: Date, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },

    totalTickets: { type: Number, default: 0 },
    ticketsSold: { type: Number, default: 0 },
    ticketsAvailable: { type: Number, default: 0 },

    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

eventSchema.index({ "title.en": "text", "title.ar": "text" });

const Event = mongoose.model("Event", eventSchema);
export default Event;
