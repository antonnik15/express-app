import {Router} from "express";
import {
    emailOrPasswordValidationResult,
    inputUsersValidationResult,
    userVerification,
    ValidationOfNewPassword,
    ValidationOfUsersInputParameters
} from "../middlewares/input-users-validation-middlewares";
import {rateLimiterMiddleware} from "../middlewares/rate-limiter-middlewares";
import {authController} from "../application/composition-root";


export const authRouter = Router({})

authRouter.post("/registration",
    rateLimiterMiddleware,
    ValidationOfUsersInputParameters,
    inputUsersValidationResult,
    userVerification,
    authController.registration.bind(authController))

authRouter.post("/registration-confirmation",
    rateLimiterMiddleware,
    authController.confirmationRegistration.bind(authController))

authRouter.post("/registration-email-resending",
    rateLimiterMiddleware,
    ValidationOfUsersInputParameters[2],
    inputUsersValidationResult,
    authController.resendEmailConfirmation.bind(authController))

authRouter.post("/login",
    rateLimiterMiddleware,
    authController.login.bind(authController)
)

authRouter.post("/refresh-token",
    authController.getNewRefreshToken.bind(authController))

authRouter.post("/logout",
    authController.logout.bind(authController))

authRouter.get("/me",
    authController.authMiddleware.verificationUserByAccessToken.bind(authController),
    authController.getInfoAboutCurrentUser.bind(authController))

authRouter.post('/password-recovery',
    rateLimiterMiddleware,
    ValidationOfUsersInputParameters[2],
    emailOrPasswordValidationResult,
    authController.recoveryPassword.bind(authController))

authRouter.post('/new-password',
    rateLimiterMiddleware,
    ValidationOfNewPassword,
    emailOrPasswordValidationResult,
    authController.changePassword.bind(authController))
