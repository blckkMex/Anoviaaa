import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import anoviaAuthRouter from "./anovia-auth.js";
import anoviaPublicRouter from "./anovia-public.js";
import anoviaGalleryRouter from "./anovia-gallery.js";
import anoviaAdminRouter from "./anovia-admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(anoviaAuthRouter);
router.use(anoviaPublicRouter);
router.use(anoviaGalleryRouter);
router.use("/admin", anoviaAdminRouter);

export default router;
