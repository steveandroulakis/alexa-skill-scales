import { HandlerInput } from "ask-sdk";

export const preInterceptor = {
  // async process(handlerInput: HandlerInput) {
  //   console.log(
  //     "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
  //   );
  // }
  async process(handlerInput: HandlerInput) {
    if ("session" in handlerInput.requestEnvelope) {
      if (handlerInput.requestEnvelope.session.new) {
        const attributes = await handlerInput.attributesManager.getPersistentAttributes();
        console.log(attributes);

        if ("invocationCount" in attributes) {
          attributes["invocationCount"] = attributes["invocationCount"] + 1;
        } else {
          attributes["invocationCount"] = 1;
        }

        handlerInput.attributesManager.setPersistentAttributes(attributes);

        handlerInput.attributesManager.savePersistentAttributes();
      }
    }
  }
};
