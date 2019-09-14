/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from "ask-sdk";

import {
  LaunchRequestHandler,
  StopIntentHandler,
  SessionEndedHandler,
  AnyIntentRequest
} from "./handlers/default_handler";
import { preInterceptor } from "./handlers/interceptors";
import { CONSTANTS } from "./helpers/constants";

const skillBuilder = Alexa.SkillBuilders.standard();

export const handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
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
