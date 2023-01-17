import mongoose from 'mongoose';
import 'dotenv/config';


const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión a la base de datos establecida!')
  } catch (error) {
    console.log('Ocurrio un error al realizar la conexión a la DB!')
    process.exit(1);
  }
}

export default dbConnect