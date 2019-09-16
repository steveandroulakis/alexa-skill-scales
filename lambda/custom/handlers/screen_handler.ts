import { HandlerInput } from "ask-sdk";
import * as aplTemplateObj from "../data/scale_screen.json";

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

export function addScreen(
  handlerInput: HandlerInput,
  heroText: string,
  subText: string
): HandlerInput {
  const datasources = aplTemplateObj.datasources;
  datasources.data.heroText = heroText;
  datasources.data.subText = subText;

  if (supportsDisplay(handlerInput)) {
    handlerInput.responseBuilder.addDirective({
      type: "Alexa.Presentation.APL.RenderDocument",
      document: aplTemplateObj.document,
      datasources: datasources
    });
  }

  return handlerInput;
}
