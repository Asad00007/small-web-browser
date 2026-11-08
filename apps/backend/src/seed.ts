import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URL = process.env.MONGODB_URL;

if (!MONGO_URL) {
  console.error('MongoDB environment variable missing.');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({ name: String }, { timestamps: true });
const SiteSchema = new mongoose.Schema({
  url: String,
  title: String,
  rawHtml: String,
});
const HistoryLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  siteId: mongoose.Schema.Types.ObjectId,
  action: { type: String, enum: ['visit', 'search'] },
  query: String,
  timestamp: Date,
});

const UserModel = mongoose.model('User', UserSchema);
const SiteModel = mongoose.model('Site', SiteSchema);
const HistoryModel = mongoose.model('HistoryLog', HistoryLogSchema);

// Mock data content representing a decentralized ecosystem
const mockSites = [
  {
    url: 'smallweb://retro-forge.home',
    title: 'The Retro Forge',
    rawHtml: `
      <div style="font-family: monospace; padding: 20px; color: #333;">
        <h1>Welcome to the Retro Forge 🎮</h1>
        <p>A personal workspace dedicated to preservation of old text adventures and terminal games.</p>
        <p>Currently researching cooking algorithms inside vintage text systems.</p>
      </div>
    `,
  },
  {
    url: 'smallweb://garden-notes.web',
    title: "Nora's Secret Garden",
    rawHtml: `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h1>Nora's Secret Garden 🌿</h1>
        <p>A quiet corner detailing urban agricultural setups and retro automated watering techniques.</p>
        <p>Latest log: Best recipes for making compost stew at home.</p>
      </div>
    `,
  },
  {
    url: 'smallweb://terminal-cooking.net',
    title: 'The Byte Sized Kitchen',
    rawHtml: `
      <div style="padding: 20px; background: #fafafa; color: #111;">
        <h1>The Byte Sized Kitchen 🍳</h1>
        <p>A repository of minimalist cooking directions and ingredient math calculators.</p>
        <p>Learn how to optimize space inside small kitchens using terminal workflows.</p>
      </div>
    `,
  },
  {
    url: 'smallweb://cyber-archive.org',
    title: 'The Cybernetic Archive',
    rawHtml: `
      <div style="padding: 20px; font-family: Courier;">
        <h1>System Log: Cybernetic Archive 💾</h1>
        <p>Public ledger containing retro tech specifications, driver backups, and hardware logs.</p>
      </div>
    `,
  },
];

const mockUsers = [
  'Alice Dev',
  'Bob Designer',
  'Charlie Chef',
  'Diana Gardener',
];

async function runSeed() {
  try {
    console.log('Connecting to db via URL');
    await mongoose.connect(MONGO_URL!);
    console.log('Connected Successfully');

    // delete
    console.log('Deleting old data...');
    await UserModel.deleteMany({});
    await SiteModel.deleteMany({});
    await HistoryModel.deleteMany({});
    console.log('Deletion successful');

    // sites
    console.log('Inserting sites');
    const createdSites = await SiteModel.insertMany(mockSites);
    console.log(`${createdSites.length} inserted successfully`);

    // users
    const baseTime = new Date();

    for (const username of mockUsers) {
      const user = await UserModel.create({ name: username });
      console.log(`Simulating time logs for user: ${user.name}`);

      // sequence of events moving backward to satisfy the 1-hour active history rule
      const actions = [
        { action: 'visit', siteIndex: 0, query: undefined, minsAgo: 55 },
        {
          action: 'search',
          siteIndex: undefined,
          query: 'retro cooking',
          minsAgo: 45,
        },
        { action: 'visit', siteIndex: 2, query: undefined, minsAgo: 40 },
        { action: 'visit', siteIndex: 1, query: undefined, minsAgo: 25 },
        {
          action: 'search',
          siteIndex: undefined,
          query: 'garden algorithms',
          minsAgo: 15,
        },
        { action: 'visit', siteIndex: 1, query: undefined, minsAgo: 5 },
      ];

      for (const act of actions) {
        const eventTimestamp = new Date(
          baseTime.getTime() - act.minsAgo * 60 * 1000,
        );

        await HistoryModel.create({
          userId: user._id,
          siteId:
            act.siteIndex !== undefined
              ? createdSites[act.siteIndex]._id
              : undefined,
          action: act.action as 'visit' | 'search',
          query: act.query,
          timestamp: eventTimestamp,
        });
      }
    }
    console.log('Seed complete. Small web network successfully configured!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

runSeed();
