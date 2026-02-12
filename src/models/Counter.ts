import { model, models, Schema } from "mongoose";

const CounterSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

export const Counter = models.Counter || model("Counter", CounterSchema);
