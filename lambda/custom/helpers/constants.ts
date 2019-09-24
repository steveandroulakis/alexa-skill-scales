import configObj from "../data/config.json";
import { HandlerInput } from "ask-sdk";
import SCALE_LIB from "./scales/scale_library.json";
import { humanName } from "./scales/scale_functions";

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

  return humanName(keys[rand], attribute);
}

// for RandomIntent
export function randomKey(): string {
  const scaleLibrary = SCALE_LIB["scale"]["key"];
  const keys = Object.keys(scaleLibrary);

  const rand = Math.floor(Math.random() * keys.length);

  return keys[rand];
}

// for RandomIntent
export function randomMode(): string {
  const scaleLibrary = SCALE_LIB["scale"]["mode"];
  const keys = Object.keys(scaleLibrary);

  const rand = Math.floor(Math.random() * keys.length);

  return keys[rand];
}

export function formatKey(key: string): string {
  if (key.match(/^[AEF]/i)) {
    return `an ${key}`;
  }

  return `a ${key}`;
}

export function scaleSuggestion(): string {
  return `${formatKey(randomScaleAttribute("key"))}
  ${randomScaleAttribute("mode")} scale`;
}

export function scaleHint(suggestion: string) {
  const hintSpeech = [
    `Try asking me to play ${suggestion} for two octaves`,
    `For example, ask me to play ${suggestion}, slow`,
    `Try asking for ${suggestion} for two octaves at a fast speed`,
    `How about asking me for ${suggestion} for one octave at moderate speed`,
    `How about ${suggestion}?`,
    `Try asking for ${suggestion}?`,
    `What about ${suggestion} at a medium pace?`,
    `For example, play ${suggestion} over one octave.`
  ];
  return randomSpeech(hintSpeech);
}

export function INTRO(suggestion: string) {
  return `Scales can play in all keys from A to G, including sharps and flats. I know three scales right now. Major, Melodic Minor, and Harmonic minor. I can play up to two octaves, at a few speeds, slow, moderate, and fast. ${scaleHint(
    suggestion
  )}. What can I play for you?`;
}

export function INTRO_BRIEF(suggestion: string) {
  return `Scales can play major, natural minor and harmonic minor. ${scaleHint(
    suggestion
  )}. What shall I play?`;
}

export function WHAT_SCALE(suggestion: string) {
  const smallPause = `<break time="0.4s"/>`;

  const PHRASES = [
    `What scale can I play? Or ask me to stop.`,
    `What scale can I play? Or ask me to stop.`,
    `Perhaps I can play ${suggestion}, at a fast pace. ${smallPause} What shall I play?`,
    `Perhaps I can play ${suggestion}. ${smallPause} What can I play?`,
    `I rather like ${suggestion}. ${smallPause} What would you like.`,
    `Maybe I could play ${suggestion}. ${smallPause} Which one will you have?`,
    `Maybe I could play ${suggestion} at a moderate pace. ${smallPause} Which one will you have?`,
    `What scale would you like. Or just tell me to stop.`,
    `Perhaps you might like ${suggestion} over two octaves. ${smallPause} What can I play for you?`,
    `Perhaps you might like ${suggestion}. ${smallPause} What can I play?`
  ];

  return randomSpeech(PHRASES);
}

export const ANOTHER = [
  "Another?",
  "Again?",
  "Another?",
  "Again?",
  "Shall I repeat this scale?",
  "Shall I play it again?",
  "Shall I play this scale again?",
  "Do you want another listen?",
  "Do you want to hear the scale again?",
  "Do you want to listen to another?",
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
  "Okay.",
  "I've got this.",
  "No worries.",
  "Okay.",
  "Okay.",
  "No worries.",
  "Great.",
  "Fantastic.",
  "Lovely.",
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
  "Here goes",
  "Watch out, here is",
  "Look out, it's",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
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
  return handlerInput.responseBuilder.speak(speechTmp).reprompt(speechTmp);
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
