export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = 'Only image file are allowed!';
    return callback(null, false);
  }
  callback(null, true);
};
