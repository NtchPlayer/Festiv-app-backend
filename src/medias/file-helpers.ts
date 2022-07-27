export const imageFileFilter = (req, file, callback) => {
  console.log(file);
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = 'Only image file are allowed!';
    return callback(null, false);
  }
  callback(null, true);
};
