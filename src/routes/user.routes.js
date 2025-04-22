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
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory
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

router.route("/update-password").patch(verifyJWT,changeCurrentPassword);

router.route("/current-user").get(verifyJWT,getCurrentUser);

router.route("/update-details").patch(verifyJWT,updateAccountDetails); 

router.route("/update-avatar").patch(verifyJWT,upload.fields([
  {
    name:"avatar",
    maxCount:1
  }
]),updateAvatar)

router.route("/update-cover-image").patch(verifyJWT,upload.fields([
  {
    name:"coverImage",
    maxCount:1
  }
]),updateCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)
export default router;
