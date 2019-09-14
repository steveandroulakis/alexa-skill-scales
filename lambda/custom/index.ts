/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from "ask-sdk";

import {
  LaunchRequestHandler,
  StopIntentHandler,
  SessionEndedHandler,
  AnyIntentRequest,
  PlayScaleIntent
} from "./handlers/default_handler";
import { preInterceptor } from "./handlers/interceptors";
import { CONSTANTS } from "./helpers/constants";

const skillBuilder = Alexa.SkillBuilders.standard();

export const handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayScaleIntent,
    StopIntentHandler,
    AnyIntentRequest,
    SessionEndedHandler
  )
  //  .addErrorHandlers(ErrorHandler)
  .withTableName(CONSTANTS.CONFIG.LOCALDB_TABLE)
  .withAutoCreateTable(true)
  .addRequestInterceptors(preInterceptor)
  .lambda();

exports.typescriptTemplate = handler;
