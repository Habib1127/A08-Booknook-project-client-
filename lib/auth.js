import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Reuse one Mongo connection across hot reloads and serverless invocations.
const globalForMongo = globalThis;
const client =
  globalForMongo.__booknookMongo || new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
if (process.env.NODE_ENV !== "production") globalForMongo.__booknookMongo = client;

const db = client.db(process.env.DB_NAME || "booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // after registering, send the user to the Login page
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    // Issues the JWT that the Express API verifies through /api/auth/jwks
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }),
      },
    }),
  ],
});
