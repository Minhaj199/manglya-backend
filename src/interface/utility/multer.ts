import multer from 'multer'




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') 
    }
  })
export const upload = multer({ storage: storage });


