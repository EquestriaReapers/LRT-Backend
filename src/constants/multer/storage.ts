import { diskStorage } from "multer";
import { extname } from "path";

const storagePerfil = diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, callback) => {
            callback(null, generateFilename(file));
        }
    });

export const multerOptions = {

    fileFilter: (req, file, callback) => {
      const ext = extname(file.originalname);
      if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
        return callback(new Error("Solo se permiten imagenes && pdf"));
      }
      callback(null, true);
    },
    storage: storagePerfil,

}


//const imagePath = file ? process.env.DATABASE_URL + file.path.replace("\\", "/") : "default"; // This is the code that I used in the past to save the image path in the database

/*@UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage : diskStorage({
            destination : './uploads/profiles',
            filename : (req, file, cb) => {
              cb(null, file.originalname);
            }
        })
      }
    )
  )
  */
 
  function generateFilename(file) {
    return `${Date.now()}.${extname(file.originalname)}`;
  }

