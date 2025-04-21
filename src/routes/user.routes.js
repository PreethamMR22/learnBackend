import { Router } from "express";
import {
  registerUser,
  userLogout,
  userLogin,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage
} from "../controllers/user.controller.js"; //end alli use .js, otherwise it gives error
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
); //here the call has already come to /users and now we
//are making the call to /register , so the api hits the url => http://localhost:8000/users/register
//now if i wanna make a login methid here /users/login band bidatte, if i writehere only

router.route("/login").post(userLogin);

router.route("/logout").post(verifyJWT, userLogout);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/update-password").post(verifyJWT,changeCurrentPassword);

router.route("/current-user").post(verifyJWT,getCurrentUser);

router.route("/update-details").patch(verifyJWT,updateAccountDetails); 

router.route("/avtar-update").patch(verifyJWT,upload.single("avatar"),updateAvatar)

router.route("/cover-image-update").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)

export default router;
