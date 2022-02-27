import { promises } from 'fs';
import { isEmpty } from '../validation/validators.js'
import { query, end } from '../db.js'
import { uploadImagesFromDisk } from '../data/images.js'
import { createRest } from '../data/dataCreator.js';

const schemaFile = './sql/schema.sql'
const insertFile = './sql/insert-orders.sql'

function requireEnv(vars = []) {
  const missing = [];

  vars.forEach((v) => {
    if (!process.env[v] || isEmpty(process.env[v])) {
      missing.push(v);
    }
  });

  if (missing.length > 0) {
    console.error(`${missing.join(', ')} vantar í umhverfi`);
    process.exit(1);
  }
}

requireEnv(['DATABASE_URL', 'CLOUDINARY_URL', 'IMAGE_FOLDER']);

const {
  DATABASE_URL: databaseUrl,
  CLOUDINARY_URL: cloudinaryUrl,
  IMAGE_FOLDER: imageFolder,
} = process.env;

async function create() {
  console.info(`Set upp gagnagrunn á ${databaseUrl}`);
  console.info(`Set upp tengingu við Cloudinary á ${cloudinaryUrl}`);

  let images = []

  // Buá til gagnagrunn og categories
  const data = await promises.readFile(schemaFile)

  await query(data.toString('utf-8'));

  try {
    images = await uploadImagesFromDisk(imageFolder);
    console.info(`Sendi ${images.length} myndir á Cloudinary`);
  } catch (e) {
    console.error('Villa við senda myndir á Cloudinary:', e.message);
  }

  console.log(images)

  const rest = await createRest(images);

  const orders = await promises.readFile(insertFile)

  await query(orders.toString('utf-8'));

  await end();

  console.info('RFC gögn komin inn í gagnagrunn.')
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
