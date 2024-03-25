import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@google-translate-clone-portfolio.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionString) throw new Error("No connection string");

const connectDB = async () => {
  if (mongoose.connection?.readyState >= 1) 
    throw new Error("Already connected to DB");

  

  try {
    await mongoose.connect(connectionString);
    ("Connected to DB");
  } catch (err) {
    throw new Error(`Could not connect to DB: ${err}`);
  }
};

export default connectDB;