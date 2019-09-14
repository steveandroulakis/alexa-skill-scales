/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from "ask-sdk";

import {
  LaunchRequestHandler,
  StopIntentHandler,
  SessionEndedHandler,
  AnyIntentRequest
} from "./handlers/default_handler";

const skillBuilder = Alexa.SkillBuilders.custom();

export const handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    StopIntentHandler,
    AnyIntentRequest,
    SessionEndedHandler
  )
  //  .addErrorHandlers(ErrorHandler)
  // .withTableName(configObj.CONSTANTS.LOCALDB_TABLE)
  // .withAutoCreateTable(true)
  // .addRequestInterceptors(preInterceptor)
  .lambda();

exports.typescriptTemplate = handler;
