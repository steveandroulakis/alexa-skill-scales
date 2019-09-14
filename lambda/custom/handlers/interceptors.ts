import { HandlerInput } from "ask-sdk";

export const preInterceptor = {
  // async process(handlerInput: HandlerInput) {
  //   console.log(
  //     "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
  //   );
  // }
  async process(handlerInput: HandlerInput) {
    // if ("session" in handlerInput.requestEnvelope) {
    // }
  }
};
