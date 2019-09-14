/* eslint-disable  func-names */
/* eslint-disable  no-console */

import { RequestHandler, HandlerInput } from "ask-sdk";
import { STATES } from "../helpers/state";
import { getSlotID } from "../helpers/slots";
import { IntentRequest } from "ask-sdk-model";
import {
  ScaleAttributes,
  ScaleAttributeSet,
  getDefaultScaleAttributes,
  computeScaleAttributes,
  speechScaleResponse,
  scaleAudioResponse
} from "../helpers/scales/scale_functions";
import {
  randomSpeech,
  ANOTHER,
  INTRO,
  polly,
  INTRO_BRIEF
} from "../helpers/constants";

// TODO: This intent has been hard-wired to accept requests from
// anything not implemented (e.g. 'help', 'yes', 'no')
// Progressively build handlers for these intents and remove from here
export const LaunchRequestHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle: async function(handlerInput: HandlerInput) {
    handlerInput.attributesManager.setSessionAttributes({
      state: STATES.DEFAULT
    });

    const attributes = await handlerInput.attributesManager.getPersistentAttributes();

    let speech = INTRO;

    if ("invocationCount" in attributes) {
      if (
        attributes["invocationCount"] > 3 &&
        attributes["invocationCount"] % 5 !== 0
      ) {
        speech = INTRO_BRIEF;
      }
    }

    const resp = handlerInput.responseBuilder
      .speak(polly(speech))
      .withShouldEndSession(false)
      .getResponse();
    return resp;
  }
};

export const PlayScaleIntent: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name === "PlayScaleIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.YesIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.RepeatIntent")
    );
  },
  handle: async function(handlerInput: HandlerInput) {
    const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

    const savedScaleAttributes: ScaleAttributes =
      persistentAttributes["scaleAttributes"];

    const requestScaleAttributes: ScaleAttributes = {
      key: getSlotID(handlerInput, "key") || undefined,
      mode: getSlotID(handlerInput, "mode") || undefined,
      speed: getSlotID(handlerInput, "speed") || undefined,
      octave: getSlotID(handlerInput, "octave") || undefined
    };

    const attributes: ScaleAttributeSet = {
      defaultScaleAttributes: getDefaultScaleAttributes(),
      savedScaleAttributes: savedScaleAttributes,
      requestScaleAttributes: requestScaleAttributes
    };

    const computedScaleAttributes = computeScaleAttributes(attributes);

    let speech = ``;

    speech = speechScaleResponse(
      computedScaleAttributes,
      attributes.requestScaleAttributes
    );

    // TODO turn me into a function
    speech = `${speech} ${scaleAudioResponse(computedScaleAttributes)}`;
    speech = `${speech} ${randomSpeech(ANOTHER)}`;

    // remember where we're up to
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes["scaleAttributes"] = computedScaleAttributes;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    console.log(speech);

    const resp = handlerInput.responseBuilder
      .speak(polly(speech))
      .withShouldEndSession(false)
      .getResponse();
    return resp;
  }
};

export const HelpIntentHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.HelpIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.FallbackIntent")
    );
  },
  handle: function(handlerInput: HandlerInput) {
    // console.log(JSON.stringify(handlerInput));
    const resp = handlerInput.responseBuilder
      .speak(polly(INTRO))
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
          "AMAZON.StopIntent" ||
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent")
    );
  },
  handle: function(handlerInput: HandlerInput) {
    // console.log(JSON.stringify(handlerInput));
    const resp = handlerInput.responseBuilder
      .speak(polly("Until next time, goodbye."))
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

    const resp = handlerInput.responseBuilder.speak(polly(prompt));

    resp.withShouldEndSession(false);
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
