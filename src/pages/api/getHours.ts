import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    console.log('Connected to MongoDB'); // Debugging-Ausgabe

    const db = client.db('agrino');
    console.log('Connected to database:', db.databaseName); // Debugging-Ausgabe

    const collections = await db.collections();
    console.log('Collections:', collections.map(col => col.collectionName));

    if (!collections.find(col => col.collectionName === 'hours')) {
      throw new Error('Collection "hours" does not exist');
    }

    const hours = await db.collection('hours').find({}).toArray();
    console.log('Fetched hours:', hours); // Debugging-Ausgabe

    res.status(200).json(hours);
  } catch (error) {
    console.error('Error fetching hours:', error.message);
    res.status(500).json({ error: `Unable to fetch data: ${error.message}` });
  }
}
