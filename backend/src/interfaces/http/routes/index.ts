import { Router } from "express";
import projectRoutes from "./project.routes";
import documentDiscoveryRoutes from "./document-discovery.routes";
import prdRouter from "./prd.routes";

const router = Router();

router.use("/projects", projectRoutes);
router.use("/projects", documentDiscoveryRoutes);
router.use("/projects", prdRouter);

export default router;
