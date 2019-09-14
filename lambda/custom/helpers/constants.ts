import configObj from "../data/config.json";
import { HandlerInput } from "ask-sdk";
import SCALE_LIB from "./scales/scale_library.json";

export const CONSTANTS = {
  CONFIG: configObj
};

export function isOneShot(handlerInput: HandlerInput): boolean {
  if ("session" in handlerInput.requestEnvelope) {
    if (handlerInput.requestEnvelope.session.new) {
      if (handlerInput.requestEnvelope.request.type === "IntentRequest") {
        return true;
      }
    }
  }

  return false;
}

export const SOUNDFX = `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01"/>`;

export const GOODBYE = [
  "See you next time",
  "Goodbye for now",
  "See you later",
  "Bye bye"
];

export function randomScaleAttribute(attribute: string): string {
  const scaleLibrary = SCALE_LIB["scale"][attribute];
  const keys = Object.keys(scaleLibrary);

  const rand = Math.floor(Math.random() * keys.length);

  return scaleLibrary[keys[rand]];
}

export function scaleSuggestion(): string {
  return `${randomScaleAttribute("key")} ${randomScaleAttribute("mode")}`;
}

export function scaleHint() {
  const hintSpeech = [
    `Try asking me to play ${scaleSuggestion()} for two octaves`,
    `For example, ask me to play ${scaleSuggestion()}, slow`,
    `Try asking for ${scaleSuggestion()} for two octaves at a fast speed`,
    `How about asking me for ${scaleSuggestion()} for one octave at moderate speed`,
    `How about a ${scaleSuggestion()} scale?`,
    `Try asking for ${scaleSuggestion()} scale?`,
    `What about ${scaleSuggestion()} at a medium pace?`,
    `For example, play ${scaleSuggestion()} over one octave.`
  ];
  return randomSpeech(hintSpeech);
}

export const INTRO = ` Scales can play in all keys from A to G, including sharps and flats. I can play up to two octaves, and many speeds, slow, moderate, and fast. ${scaleHint()}. What shall I play?`;

export const INTRO_BRIEF = ` Scales can play all keys, at multiple speeds. ${scaleHint()}. What shall I play?`;

export const ANOTHER = [
  "Another?",
  "Again?",
  "Want that again?",
  "Shall I repeat?",
  "Another?",
  "Again?",
  "Want that again?",
  "Will I repeat?",
  "Shall I play it again?",
  "One more time?",
  "One more listen?",
  "Do you want to hear it again?",
  "Do you want to listen to another?",
  "Shall I play another time?",
  "Can I repeat that?",
  "Once more?"
];

export const ACKNOWLEDGE = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Okay.",
  "Alright.",
  "No worries.",
  "Okay.",
  "No worries.",
  "Okay.",
  "Okay.",
  "No worries.",
  "Great.",
  "Fantastic.",
  "No problem.",
  "Let's do it.",
  "Let's go.",
  "Cool.",
  "Listen in.",
  "Here I go.",
  "Awesome.",
  "Sure thing.",
  "Okie doke."
];

export const HERE_IS = [
  "Here's",
  "Here is",
  "Playing",
  "I'll play",
  "I'll do",
  "Here comes",
  "Here goes"
];

export const WHAT_SCALE = [
  `What scale can I play? Or ask me to stop.`,
  `What scale can I play? Perhaps ${scaleSuggestion()}?`,
  `What scale would you like? Maybe a ${scaleSuggestion()} scale?`,
  `What scale would you like? Or just tell me to stop.`,
  `What scale can I play for you? Perhaps ${scaleSuggestion()}?`
];

export interface ScaleResponsePayload {
  speech: string;
  screenPayload: {};
}

export function prepareResponse(
  handlerInput,
  scaleResponse: ScaleResponsePayload
) {
  let speechTmp = `<voice name="Brian"><lang xml:lang="en-AU">${
    scaleResponse.speech
  }</lang></voice>`;

  if ("session" in handlerInput.requestEnvelope) {
    if (handlerInput.requestEnvelope.session.new) {
      speechTmp = `${SOUNDFX} ${speechTmp}`;
    }
  }
  return handlerInput.responseBuilder.speak(speechTmp);
}

export function randomSpeech(speechList: string[]): string {
  const rand = Math.floor(Math.random() * speechList.length);

  return speechList[rand];
}

export enum RequestTypes {
  Launch = "LaunchRequest",
  Intent = "IntentRequest",
  SessionEnded = "SessionEndedRequest",
  SystemExceptionEncountered = "System.ExceptionEncountered"
}

export enum IntentTypes {
  Help = "AMAZON.HelpIntent",
  Stop = "AMAZON.StopIntent",
  Cancel = "AMAZON.CancelIntent",
  Fallback = "AMAZON.FallbackIntent",

  HelloWorld = "HelloWorldIntent"
}

export enum ErrorTypes {
  Unknown = "UnknownError",
  Unexpected = "UnexpectedError"
}

export enum LocaleTypes {
  deDE = "de-DE",
  enAU = "en-AU",
  enCA = "en-CA",
  enGB = "en-GB",
  enIN = "en-IN",
  enUS = "en-US",
  esES = "es-ES",
  frFR = "fr-FR",
  itIT = "it-IT",
  jaJP = "ja-JP"
}

export enum Strings {
  SKILL_NAME = "SKILL_NAME",
  WELCOME_MSG = "WELCOME_MSG",
  GOODBYE_MSG = "GOODBYE_MSG",
  HELLO_MSG = "HELLO_MSG",
  HELP_MSG = "HELP_MSG",
  ERROR_MSG = "ERROR_MSG",
  ERROR_UNEXPECTED_MSG = "ERROR_UNEXPECTED_MSG"
}
