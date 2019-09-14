import configObj from "../data/config.json";

export const CONSTANTS = {
  CONFIG: configObj
};

export function polly(speech) {
  return `<voice name="Brian"><lang xml:lang="en-AU">${speech}</lang></voice>`;
}

export const SOUNDFX = `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01"/>`;

export const HINT = [
  "Try asking me to play F sharp minor for two octaves",
  "For example, ask me to play see harmonic minor, slow",
  "Try asking for bee flat minor for two octaves at a fast speed",
  "How about asking me for an ay minor for one octave at normal speed",
  "How about a dee natural minor scale?"
];

export const INTRO = `${SOUNDFX} Scales can play in all keys from A to G, including sharps and flats. I can play up to two octaves, and many speeds, slow, moderate, and fast. ${randomSpeech(
  HINT
)}.`;

export const INTRO_BRIEF = `${SOUNDFX} Scales can play in all keys, major and minor, different speeds, up to two octaves. What shall I play?`;

export const ANOTHER = [
  "Another?",
  "Again?",
  "Want that again?",
  "Shall I repeat?",
  "Another?",
  "Again?",
  "Want that again?",
  "Shall I repeat?",
  "Shall I play it again?",
  "One more time?",
  "One more listen?",
  "Do you want to hear it again?",
  "Listen to another?",
  "I'll play another time?",
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
  "Alright.",
  "No worries.",
  "Okay.",
  "Alright.",
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
