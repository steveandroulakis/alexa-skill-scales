/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from "ask-sdk";

import {
  LaunchRequestHandler,
  StopIntentHandler,
  SessionEndedHandler,
  AnyIntentRequest,
  PlayScaleIntent,
  HelpIntentHandler,
  PlayScaleIncompleteIntent,
  NoRepeatIntent
} from "./handlers/default_handler";
import { preInterceptor, postInterceptor } from "./handlers/interceptors";
import { CONSTANTS } from "./helpers/constants";

const skillBuilder = Alexa.SkillBuilders.standard();

export const handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayScaleIncompleteIntent,
    PlayScaleIntent,
    NoRepeatIntent,
    HelpIntentHandler,
    StopIntentHandler,
    AnyIntentRequest,
    SessionEndedHandler
  )
  //  .addErrorHandlers(ErrorHandler)
  .withTableName(CONSTANTS.CONFIG.LOCALDB_TABLE)
  .withAutoCreateTable(true)
  .addRequestInterceptors(preInterceptor)
  .addResponseInterceptors(postInterceptor)
  .lambda();

exports.typescriptTemplate = handler;
