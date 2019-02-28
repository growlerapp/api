import { Document, Model } from 'mongoose'

interface Growler extends Document {
  name: String,
  address: String,
  geometry: {
    type: String,
    coordinates: [Number, Number]
  },
  beers: {
    name: String,
    price: Number,
    size: Number
  }
}

interface StaticMethods {
  findByProximity(lat: number, lon: number): Promise<Growler[]>
}

let growler: Model<Growler> & StaticMethods;
export = growler;
