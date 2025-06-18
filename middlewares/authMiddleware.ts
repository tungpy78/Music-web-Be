import { NextFunction , Request, Response} from "express";

// Extend the Request interface to include jwtDecoded
declare global {
  namespace Express {
    interface Request {
      jwtDecoded?: any;
    }
  }
}
import { StatusCodes } from "http-status-codes";
import { JwtProvider } from "../providers/JwtProvider";
import { TokenExpiredError } from "jsonwebtoken";
import { validationResult } from "express-validator";

const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  // Simulate authorization logic
  const accessTokenFromHeader = req.headers.authorization
  
    if (!accessTokenFromHeader) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: (Token not found)" });
        return;
    }
    try {
        const accessTokenDecoded = await JwtProvider.verifyToken(
            accessTokenFromHeader.substring("Bearer ".length),
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string
        );
        req.jwtDecoded = accessTokenDecoded;
        next();

    } catch (error: Error | any) {
      console.log("Token error:", error.message);

        //truong hop token het han
        if(error instanceof TokenExpiredError) {
            res.status(StatusCodes.GONE).json({ message: "Need to refresh Token" });
            return;
        }
        //truong hop token khong hop le
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Please Login." });
    }
}

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await isAuthorized(req, res, async () => {

      const userData = req.jwtDecoded;
      if (userData?.userInfo?.role=== "Admin") {
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Forbidden: You are not an admin." +  JSON.stringify(userData),});
        return;
      }
    });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "Unauthorized: Please Login.",});
    return;
  }    
}

const isManager = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await isAuthorized(req, res, async () => {

      const userData = req.jwtDecoded;
      
      if (userData?.userInfo?.role === "Admin"||userData?.userInfo?.role === "Manager") {
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Forbidden: You are not an Manager." + JSON.stringify(userData)});
        return;
      }
    });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "Unauthorized: Please Login.",});
    return;
  }
}

const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const extractedErrors = result.array().map(err => {
      if ('path' in err) {
        return {
          field: err.path,
          message: err.msg,
        };
      } else {
        // fallback cho AlternativeValidationError
        return {
          field: 'unknown',
          message: err.msg,
        };
      }
    });

    res.status(StatusCodes.BAD_REQUEST).json({
      message: extractedErrors.map(err => err.message).join(', '),
      errors: extractedErrors,
    });
    return;
  }

  next();
};

export const AuthMiddleware = {
    isAuthorized,
    isAdmin,
    isManager,
    validateRequest
}
  