import dotenv from 'dotenv';

dotenv.config();

// export const PORT = 5001;
// export const mongoDBURL = "mongodb+srv://RurouniX:Gintama121@cluster0.krb12ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const PORT = process.env.PORT || 5001;
export const mongoDBURL = process.env.MONGODB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;