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
      <div style="font-family: 'Courier New', monospace; padding: 30px; max-width: 800px; margin: 0 auto; background: #1a1a1a; color: #00ff00; border: 2px solid #333; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
        <header style="border-bottom: 2px dashed #00ff00; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 2.2rem; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Retro Forge 🎮</h1>
          <p style="color: #888; font-style: italic; margin-top: 5px;">Node ID: 88-FORGE // Status: Online</p>
        </header>

        <section style="margin-bottom: 25px;">
          <h2 style="color: #fff; font-size: 1.4rem; background: #222; padding: 5px 10px;">> Manifest</h2>
          <p>A personal workspace dedicated to the meticulous preservation of old text adventures, MUD platforms, and terminal-based interactive fiction.</p>
          <p>We believe that true immersion doesn't require billions of polygons—just 80 columns of pure, unadulterated green phosphorus text.</p>
        </section>

        <section style="margin-bottom: 25px;">
          <h2 style="color: #fff; font-size: 1.4rem; background: #222; padding: 5px 10px;">> Current Focus: Culinary Algorithmic Parser (CAP)</h2>
          <p>Currently researching state-machine cooking algorithms inside vintage text systems (circa 1982-1987). We are parsing how interactive fiction handled ingredient chemistry before standard physics engines existed.</p>
          <p>If you're looking for real-world mathematical breakdowns of ingredient efficiency, our peers over at <a href="smallweb://terminal-cooking.net" style="color: #00ffff; text-decoration: underline;">The Byte Sized Kitchen</a> have built fantastic data models on the subject.</p>
        </section>

        <footer style="border-top: 1px solid #333; padding-top: 15px; margin-top: 30px; font-size: 0.9rem;">
          <h3 style="margin: 0 0 10px 0; color: #fff;">Network Relays:</h3>
          <ul style="list-style-type: '>> '; padding-left: 20px; line-height: 1.8;">
            <li>Browse global hardware logs at <a href="smallweb://cyber-archive.org" style="color: #00ffff; text-decoration: underline;">The Cybernetic Archive</a></li>
            <li>Read up on alternative solar power rigs via <a href="smallweb://solar-nodes.net" style="color: #00ffff; text-decoration: underline;">Solar Nodes Network (External)</a></li>
            <li>Download old terminal compilers from <a href="smallweb://bbs-vault.xyz/software" style="color: #00ffff; text-decoration: underline;">BBS Vault (External)</a></li>
          </ul>
        </footer>
      </div>
    `,
  },
  {
    url: 'smallweb://garden-notes.web',
    title: "Nora's Secret Garden",
    rawHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 35px; max-width: 75px; max-width: 700px; margin: 20px auto; background: #faf8f5; color: #2e3d30; border: 1px solid #e1e8e2; border-radius: 12px; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 3rem;">🌿</span>
          <h1 style="margin: 10px 0 5px 0; color: #1b2e1e; font-size: 2.5rem; font-family: Georgia, serif;">Nora's Secret Garden</h1>
          <p style="color: #6b7c6e; font-style: italic; margin: 0;">Cultivating quiet data structures and heirloom seeds in the city.</p>
        </div>

        <main>
          <article style="background: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #608066; margin-bottom: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
            <h2 style="margin-top: 0; color: #1b2e1e; font-size: 1.3rem;">Latest Log: Best Recipes for Making Compost Stew at Home</h2>
            <p>True urban agriculture requires utilizing every single scrap of nitrogenous material you can harvest. Compost stew isn't for eating—it's a concentrated liquid brew designed to hyper-charge soil microbial life over a 48-hour fermentation cycle.</p>
            <p>For a clean, step-by-step layout of the kitchen spatial optimization needed to ferment things without ruining your living room layout, definitely read the workflows over on <a href="smallweb://terminal-cooking.net" style="color: #4a7051; font-weight: bold; text-decoration: underline;">The Byte Sized Kitchen</a>.</p>
          </article>

          <section>
            <h3 style="color: #1b2e1e; font-size: 1.2rem; border-bottom: 1px solid #e1e8e2; padding-bottom: 5px;">Current Projects & Experiments</h3>
            <ul>
              <li><strong>Retro Automated Watering:</strong> Restoring a 1994 solenoidal drip loop using basic relays. Full hardware layout can be verified using the schematics on <a href="smallweb://cyber-archive.org" style="color: #4a7051; font-weight: bold; text-decoration: underline;">The Cybernetic Archive</a>.</li>
              <li><strong>Rainwater Calculation Matrix:</strong> Calculating optimal barrel storage sizes against regional rainfall coefficients.</li>
            </ul>
          </section>
        </main>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e1e8e2; font-size: 0.9rem; color: #8a9c8e; text-align: center;">
          <p>Neighboring plots: <a href="smallweb://permaculture-wiki.org" style="color: #608066; margin: 0 10px;">Permaculture Wiki</a> | <a href="smallweb://retro-forge.home" style="color: #608066; margin: 0 10px;">The Retro Forge</a> | <a href="smallweb://seed-swap.exchange" style="color: #608066; margin: 0 10px;">Local Seed Swap</a></p>
        </footer>
      </div>
    `,
  },
  {
    url: 'smallweb://terminal-cooking.net',
    title: 'The Byte Sized Kitchen',
    rawHtml: `
      <div style="padding: 40px; background: #ffffff; color: #111111; max-width: 850px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; border: 1px solid #ddd;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #111; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 900; letter-spacing: -1px;">The Byte Sized Kitchen 🍳</h1>
          <span style="background: #111; color: #fff; padding: 4px 8px; font-size: 0.8rem; font-weight: bold; font-family: monospace;">v2.4_STABLE</span>
        </div>

        <p style="font-size: 1.1rem; color: #555; line-height: 1.6; margin-bottom: 30px;">
          A minimalist repository dedicated to tight cooking directions, hyper-efficient layout design, and programmatic ingredient math calculators. We show you how to optimize limited physical spaces using command-line clarity.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: #f5f5f5; padding: 20px; border: 1px solid #eee;">
            <h3 style="margin-top: 0; font-size: 1.1rem;">Space-Optimization Workflows</h3>
            <p style="font-size: 0.95rem; line-height: 1.5; color: #333;">Learn how to format your spice rack like a clean file registry, mapping containers by utility metrics rather than alphabetical labels.</p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border: 1px solid #eee;">
            <h3 style="margin-top: 0; font-size: 1.1rem;">Ingredient Chemistry Parsers</h3>
            <p style="font-size: 0.95rem; line-height: 1.5; color: #333;">We collaborate directly with gaming preservationists like <a href="smallweb://retro-forge.home" style="color: #111; font-weight: bold; text-decoration: underline;">The Retro Forge</a> to map the algorithmic history of vintage recipe simulations.</p>
          </div>
        </div>

        <div style="background: #fff8e1; border: 1px solid #ffe0b2; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
          <strong style="color: #e65100;">Notice for Urban Growers:</strong> Nora just dropped a great piece detailing nitrogen metrics for soil health. You can cross-reference her exact methodology by reading her log over at <a href="smallweb://garden-notes.web" style="color: #b71c1c; font-weight: bold; text-decoration: underline;">Nora's Secret Garden</a>.
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9rem;">
          <span style="font-weight: bold; text-transform: uppercase; color: #666; display: block; margin-bottom: 8px;">External Reference Repositories:</span>
          <a href="smallweb://nutrition-data.gov/api" style="color: #0066cc; margin-right: 15px; text-decoration: none;">↳ Nutritional Data API Matrix</a>
          <a href="smallweb://cast-iron-restoration.net" style="color: #0066cc; margin-right: 15px; text-decoration: none;">↳ Cast Iron Electrolysis Guide</a>
          <a href="smallweb://minimalist-cooking-network.org" style="color: #0066cc; text-decoration: none;">↳ Minimalist Cooking Network</a>
        </div>
      </div>
    `,
  },
  {
    url: 'smallweb://cyber-archive.org',
    title: 'The Cybernetic Archive',
    rawHtml: `
      <div style="padding: 30px; font-family: 'Courier New', Courier, monospace; background: #0f141c; color: #abb2bf; max-width: 800px; margin: 10px auto; border-top: 4px solid #4b5263; line-height: 1.6;">
        <header style="margin-bottom: 25px;">
          <h1 style="color: #61afef; margin: 0 0 5px 0; font-size: 1.8rem;">[SYSTEM LOG: CYBERNETIC ARCHIVE]</h1>
          <p style="color: #5c6370; font-size: 0.85rem; margin: 0;">Index Verified // SHA-256 Checksum: Passed // Decentralized Mesh Protocol</p>
        </header>

        <section style="background: #1e222a; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 0.95rem;">
            Welcome to the public ledger. This terminal node functions as a static storage bunker containing retro architectural specifications, driver backups, forgotten hardware schematics, and peripheral automation logs.
          </p>
        </section>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #e5c07b; border-bottom: 1px solid #3e4452; padding-bottom: 5px; font-size: 1.1rem; margin-bottom: 10px;">Available Hardware Registries</h3>
          <ul style="list-style-type: square; padding-left: 20px;">
            <li style="margin-bottom: 8px;">
              <strong>Legacy Solenoid Controller Maps:</strong> Used directly for agricultural fluid dynamics. If you are building automated watering networks, cross-reference these instructions with the practical logs at <a href="smallweb://garden-notes.web" style="color: #98c379; text-decoration: underline;">Nora's Secret Garden</a>.
            </li>
            <li style="margin-bottom: 8px;">
              <strong>ASCII Game Engines (1980-1985):</strong> Compilation trees and memory layouts. Maintained in coordination with the text-adventure preservation specialists operating out of <a href="smallweb://retro-forge.home" style="color: #98c379; text-decoration: underline;">The Retro Forge</a>.
            </li>
          </ul>
        </div>

        <footer style="font-size: 0.85rem; color: #5c6370; border-top: 1px dashed #3e4452; padding-top: 15px;">
          <span>Outbound Node Handshakes:</span>
          <div style="margin-top: 5px;">
            <a href="smallweb://mainframe-museum.org/vax" style="color: #e06c75; margin-right: 15px;">[Mainframe-Museum]</a>
            <a href="smallweb://://drivers-mirror.com" style="color: #e06c75; margin-right: 15px;">[ISA-Bus Mirror]</a>
            <a href="smallweb://kernel-pioneers.net" style="color: #e06c75;">[Kernel Pioneers]</a>
          </div>
        </footer>
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
