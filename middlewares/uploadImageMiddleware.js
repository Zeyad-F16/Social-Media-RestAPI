const multer = require('multer');
const path = require('path');

const Storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
     const ext=path.extname(file.originalname);
     cb(null,`${file.fieldname}-${Date.now()}${ext}`);
    }
});

const upload = multer({storage:Storage});

module.exports = upload;
