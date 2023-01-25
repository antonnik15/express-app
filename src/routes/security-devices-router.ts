import {Router} from "express";
import {securityDevicesController} from "../application/composition-root";


export const securityDevicesRouter = Router({});


securityDevicesRouter.get("/", securityDevicesController.getActiveSessions.bind(securityDevicesController))

securityDevicesRouter.delete("/", securityDevicesController.deleteActiveSessions.bind(securityDevicesController))

securityDevicesRouter.delete("/:deviceId", securityDevicesController.deleteActiveSessionByDeviceId.bind(securityDevicesController))