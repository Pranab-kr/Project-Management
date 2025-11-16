import multer from "multer";

const upload = multer({ dest: "public/images" });

export default upload;
