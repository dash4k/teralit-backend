import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ClientError from '../../../exceptions/client-error.js';

export const UPLOAD_FOLDER = path.resolve('src/services/uploads/files/images');

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_FOLDER),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ['image/jpeg', 'image/png'];

  if (allowedMimetypes.includes(file.mimetype)) cb(null, true);
  else cb(new ClientError('Image is required'), null);
};

export const upload = multer({
  storage,
  limits: { fieldSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

export const deleteFromDisk = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.log('Error while trying to delete the image: ', error.message);
  }
};

export default { UPLOAD_FOLDER, storage, fileFilter, upload };
