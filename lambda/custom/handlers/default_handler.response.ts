import { HandlerInput, ResponseBuilder } from "ask-sdk";
import { CONSTANTS } from "../helpers/constants";

export function supportsDisplay(handlerInput: HandlerInput) {
  const hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces
      .Display;
  return hasDisplay;
}

export function add_screen(
  handlerInput: HandlerInput,
  document: {
    [key: string]: any;
  },
  datasources: {
    [key: string]: any;
  }
): ResponseBuilder {
  const resp = handlerInput.responseBuilder;

  if (supportsDisplay(handlerInput)) {
    resp.addDirective({
      type: "Alexa.Presentation.APL.RenderDocument",
      document: CONSTANTS.APL_TEMPLATE,
      datasources: CONSTANTS.APL_TEMPLATE_DATA
    });
  }

  // save state
  return resp;
}
