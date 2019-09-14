import { HandlerInput } from "ask-sdk";
import { getDefaultScaleAttributes } from "../helpers/scales/scale_functions";

export const preInterceptor = {
  // async process(handlerInput: HandlerInput) {
  //   console.log(
  //     "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
  //   );
  // }
  async process(handlerInput: HandlerInput) {
    console.log(
      "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
    );

    if ("session" in handlerInput.requestEnvelope) {
      if (handlerInput.requestEnvelope.session.new) {
        const attributes = await handlerInput.attributesManager.getPersistentAttributes();
        console.log(attributes);

        if ("invocationCount" in attributes) {
          attributes["invocationCount"] = attributes["invocationCount"] + 1;
        } else {
          attributes["invocationCount"] = 1;
        }

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if ("scaleAttributes" in attributes) {
          sessionAttributes["scaleAttributes"] = attributes["scaleAttributes"];
        } else {
          attributes["scaleAttributes"] = getDefaultScaleAttributes();
          sessionAttributes["scaleAttributes"] = attributes["scaleAttributes"];
        }

        handlerInput.attributesManager.setPersistentAttributes(attributes);

        await handlerInput.attributesManager.savePersistentAttributes();
      }
    }
  }
};
