import fs from 'fs';
import path from 'path';

const modelDirectory = path.join(__dirname, '../prisma/models');
const outputFile = path.join(__dirname, '../prisma/schema.prisma');

const generatorConfig = `
generator client {
  provider = "prisma-client-js"
}
`;

// Determine the environment and set the datasource configuration accordingly
const env = process.env.NODE_ENV || 'development';
let datasourceConfig;

if (env === 'development') {
  datasourceConfig = `
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
`;
} else {
  datasourceConfig = `
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
`;
}

let combinedSchema = generatorConfig + datasourceConfig;

// Combine the model files
fs.readdirSync(modelDirectory).forEach((file) => {
  const filePath = path.join(modelDirectory, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  combinedSchema += fileContent + '\n';
});

// Write the combined schema to the schema.prisma file
fs.writeFileSync(outputFile, combinedSchema);
console.log('Prisma schema combined successfully!');
