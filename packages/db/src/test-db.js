import { PrismaClient } from "@prisma/client";

const client = new PrismaClient({
  connectionString: "postgresql://user:password@ep-misty-surf-a5dvkilr-pooler.us-east-2.aws.neon.tech:5432/neondb?sslmode=require"
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to the database!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await client.end();
  }
}

testConnection();
