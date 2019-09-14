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
import {
  ScaleAttributes,
  ScaleAttributeSet,
  getDefaultScaleAttributes,
  computeScaleAttributes,
  remainingScaleAttributes,
  speechScaleResponse,
  computeScaleFilename
} from "../helpers/scales/scale_functions";
import { CONSTANTS } from "../helpers/constants";

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

export const PlayScaleIntent: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "PlayScaleIntent"
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

    const remaining = remainingScaleAttributes(computedScaleAttributes);

    console.log(`COMPUTED ${JSON.stringify(computedScaleAttributes)}`);
    console.log(`REMAINING ${JSON.stringify(remaining)}`);

    let speech = ``;

    if (remaining.length >= 1) {
      speech = `Not enough info. I need ${remaining[0].input}.`;
    } else {
      speech = speechScaleResponse(
        computedScaleAttributes,
        attributes.requestScaleAttributes
      );

      // TODO turn me into a function
      speech = `${speech} <break time="0.5s"/> <audio src="${
        CONSTANTS.CONFIG.SCALE_AUDIO_URL_PREFIX
      }${computeScaleFilename(
        computedScaleAttributes
      )}" /> <break time="0.5s"/> Another?`;
    }

    const resp = handlerInput.responseBuilder
      .speak(speech)
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
