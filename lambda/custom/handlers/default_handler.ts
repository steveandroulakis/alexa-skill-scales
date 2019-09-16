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
  scaleAudioResponse,
  humanNameScreen
} from "../helpers/scales/scale_functions";
import {
  randomSpeech,
  ANOTHER,
  INTRO,
  prepareResponse,
  INTRO_BRIEF,
  ScaleResponsePayload,
  GOODBYE,
  isOneShot,
  WHAT_SCALE,
  scaleSuggestion,
  randomKey,
  randomScaleAttribute
} from "../helpers/constants";
import { addScreen } from "./screen_handler";

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

    let speech = INTRO(scaleSuggestion());

    if ("invocationCount" in attributes) {
      if (
        attributes["invocationCount"] > 3 &&
        attributes["invocationCount"] % 5 !== 0
      ) {
        speech = INTRO_BRIEF(scaleSuggestion());
      }
    }

    const scaleResponse: ScaleResponsePayload = {
      speech: speech,
      screenPayload: addScreen(handlerInput, "", "Scales by AMEB")
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(false)
      .getResponse();
  }
};

export const PlayScaleIncompleteIntent: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name === "PlayScaleIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.YesIntent") &&
      isOneShot(handlerInput) &&
      !getSlotID(handlerInput, "key") // we won't fulfil requests missing key from one-shots
    );
  },
  handle: async function(handlerInput: HandlerInput) {
    const scaleResponse: ScaleResponsePayload = {
      speech:
        "Sorry, I didn't catch some of that. What scale would you like to hear?",
      screenPayload: {}
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(false)
      .getResponse();
  }
};

export const NoRepeatIntent: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
    );
  },
  handle: async function(handlerInput: HandlerInput) {
    const scaleResponse: ScaleResponsePayload = {
      speech: `${WHAT_SCALE(scaleSuggestion())}`,
      screenPayload: {}
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(false)
      .getResponse();
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
          "AMAZON.RepeatIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "RandomScaleIntent")
    );
  },
  handle: async function(handlerInput: HandlerInput) {
    const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

    const savedScaleAttributes: ScaleAttributes =
      persistentAttributes["scaleAttributes"];

    const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
    const currentIntent = intentRequest.intent;

    // if the user asks for random
    let randKey = ``;
    let randMode = ``;
    if (currentIntent.name === "RandomScaleIntent") {
      randKey = randomKey();
      randMode = randomMode();
    }

    const requestScaleAttributes: ScaleAttributes = {
      key: getSlotID(handlerInput, "key") || randKey || undefined,
      mode: getSlotID(handlerInput, "mode") || randMode || undefined,
      speed: getSlotID(handlerInput, "speed") || undefined,
      octave: getSlotID(handlerInput, "octave") || undefined
    };

    // TODO get slot val getSlotID(handlerInput, "key")
    // validate and send through to screen

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

    // console.log(speech);

    const scaleResponse: ScaleResponsePayload = {
      speech: speech,
      screenPayload: addScreen(
        handlerInput,
        humanNameScreen(computedScaleAttributes.key, "key"),
        humanNameScreen(computedScaleAttributes.mode, "mode")
      )
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(false)
      .getResponse();
  }
};

export const HelpIntentHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle: function(handlerInput: HandlerInput) {
    // console.log(JSON.stringify(handlerInput));
    const scaleResponse: ScaleResponsePayload = {
      speech: INTRO(scaleSuggestion()),
      screenPayload: {}
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(false)
      .getResponse();
  }
};

export const CantDoThatIntentHandler: RequestHandler = {
  canHandle: function(handlerInput: HandlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "CantDoThatIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.FallbackIntent")
    );
  },
  handle: function(handlerInput: HandlerInput) {
    // console.log(JSON.stringify(handlerInput));
    const scaleResponse: ScaleResponsePayload = {
      speech: `Sorry, I can't do that yet. What scale would you like to hear?`,
      screenPayload: {}
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(false)
      .getResponse();
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

    const speech = randomSpeech(GOODBYE);

    const scaleResponse: ScaleResponsePayload = {
      speech: speech,
      screenPayload: {}
    };

    return prepareResponse(handlerInput, scaleResponse)
      .withShouldEndSession(true)
      .getResponse();
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

    const scaleResponse: ScaleResponsePayload = {
      speech: prompt,
      screenPayload: {}
    };

    const resp = prepareResponse(handlerInput, scaleResponse);

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
