/* eslint-disable  func-names */
/* eslint-disable  no-console */

import { RequestHandler, HandlerInput } from "ask-sdk";
import { STATES } from "../helpers/state";
import {
  getSlotVal,
  dynamicEntitiesFromValues,
  findClosestSlot,
  getSlotID
} from "../helpers/slots";
import { IntentRequest } from "ask-sdk-model";

// TODO: This intent has been hard-wired to accept requests from
// anything not implemented (e.g. 'help', 'yes', 'no')
// Progressively build handlers for these intents and remove from here
export const LaunchRequestHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        (handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.YesIntent" ||
          handlerInput.requestEnvelope.request.intent.name ===
            "AMAZON.NoIntent" ||
          handlerInput.requestEnvelope.request.intent.name ===
            "AMAZON.HelpIntent" ||
          handlerInput.requestEnvelope.request.intent.name ===
            "AMAZON.RepeatIntent" ||
          handlerInput.requestEnvelope.request.intent.name ===
            "AMAZON.FallbackIntent"))
    );
  },
  handle: function(handlerInput: HandlerInput) {
    // const slotName = getSlotVal(handlerInput, "name");
    // const slotDollars = getSlotVal(handlerInput, "dollars");

    // const account = findClosestSlot(slotName, []);
    // const dollars = slotDollars;

    handlerInput.attributesManager.setSessionAttributes({
      state: STATES.DEFAULT
    });

    const resp = handlerInput.responseBuilder
      .speak("Hello")
      .withShouldEndSession(false)
      .getResponse();
    return resp;
  }
};

export const StopIntentHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle: function(handlerInput: HandlerInput) {
    // console.log(JSON.stringify(handlerInput));
    const resp = handlerInput.responseBuilder
      .speak("Goodbye")
      .withShouldEndSession(true)
      .getResponse();
    return resp;
  }
};

// handle any other intent
export const AnyIntentRequest: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest";
  },
  handle: function(handlerInput: HandlerInput) {
    const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
    const currentIntent = intentRequest.intent;

    let prompt = `The Intent is, ${currentIntent.name}.`;

    if ("slots" in intentRequest.intent) {
      for (const slotName of Object.keys(intentRequest.intent.slots)) {
        const currentSlot = currentIntent.slots[slotName];

        prompt += ` A slot called, ${
          currentSlot.name
        }, was filled with the value, ${currentSlot.value}.`;

        if (
          currentSlot.resolutions &&
          currentSlot.resolutions.resolutionsPerAuthority[0]
        ) {
          if (
            currentSlot.resolutions.resolutionsPerAuthority[0].status.code ===
            "ER_SUCCESS_MATCH"
          ) {
            if (
              currentSlot.resolutions.resolutionsPerAuthority[0].values
                .length >= 1
            ) {
              prompt += ` It matched these values,`;
              currentSlot.resolutions.resolutionsPerAuthority[0].values.forEach(
                element => {
                  prompt += ` ${element.value.name}. `;
                }
              );
            }
          }
        } else {
          prompt += ` `;
        }
      }
    }

    const resp = handlerInput.responseBuilder.speak(prompt);

    const closeSession = handlerInput.attributesManager.getSessionAttributes()
      .closeSession;

    resp.withShouldEndSession(closeSession);
    resp.withSimpleCard("androula@ debug skeleton", prompt);

    return resp.getResponse();
  }
};

export const SessionEndedHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle: function(handlerInput: HandlerInput) {
    // console.log(JSON.stringify(handlerInput));
    const resp = handlerInput.responseBuilder
      .speak("")
      .withShouldEndSession(true)
      .getResponse();
    return resp;
  }
};
