import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // this is used for generating unique name to each files that gets uploaded, but since the file remains for very short time in the local drive , overrides of the files doesnt occur so frequently so it is not so essential to generate an extra unique id for each file, each creates a overhead
      cb(null, file.originalname)
    }
  })
  
 export  const upload = multer(
    { storage: storage 

})