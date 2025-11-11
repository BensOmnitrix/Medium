import { Hono } from 'hono'
import { mainRouter } from './router/mainRouter';
import {SigninType, SignupType} from "@100xbensomnitrix/medium-common-bundle";

const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string,
    SALT_ROUNDS: number
  },
  Variables: {
    signupData: SignupType,
    signinData: SigninType,
    jwtPayload: object,
  }
}>()

app.route("/api/v1",mainRouter);

export default app
