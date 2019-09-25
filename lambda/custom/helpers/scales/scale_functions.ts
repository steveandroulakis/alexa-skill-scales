import SCALE_LIBRARY from "./scale_library.json";
import {
  CONSTANTS,
  randomSpeech,
  ACKNOWLEDGE,
  HERE_IS
} from "../../helpers/constants";

export interface ScaleAttributeSet {
  defaultScaleAttributes: ScaleAttributes;
  savedScaleAttributes: ScaleAttributes;
  requestScaleAttributes: ScaleAttributes;
}

export interface AttributeInput {
  key: string;
  input: string;
}

export interface ScaleAttributes {
  key: string;
  mode: string;
  speed: string;
  octave: string;
}

// if attribute exists in the library (e.g. don't ask for 4 octaves)
export function validAttribute(attribute: string, type: string): boolean {
  return attribute in SCALE_LIBRARY["scale"][type];
}

// based on defaults, what's saved for the user and what they requested
export function computeScaleAttributes(scaleAttributeSet: ScaleAttributeSet) {
  const scaleAttributes: ScaleAttributes = {
    key: undefined,
    mode: undefined,
    speed: undefined,
    octave: undefined
  };

  console.log("IN AS...");
  console.log(scaleAttributeSet);

  // tslint:disable-next-line:forin
  for (const key in scaleAttributeSet.defaultScaleAttributes) {
    scaleAttributes[key] =
      scaleAttributeSet.requestScaleAttributes[key] ||
      scaleAttributeSet.savedScaleAttributes[key] ||
      scaleAttributeSet.defaultScaleAttributes[key];
  }

  console.log("OUT AS...");
  console.log(scaleAttributes);

  return scaleAttributes;
}

// can we fulfill the request? did the user request something invalid?
export function remainingScaleAttributes(
  computedAttributes: ScaleAttributes
): AttributeInput[] {
  const rmAttrs: AttributeInput[] = [];

  // tslint:disable-next-line:forin
  for (const key in computedAttributes) {
    if (!validAttribute(computedAttributes[key], key)) {
      rmAttrs.push({ key: key, input: computedAttributes[key] });
    }
  }

  return rmAttrs;
}

// get a human-readable name like 'C sharp' for a request
export function humanName(attribute: string, type: string): string {
  if (type === "key") {
    return SCALE_LIBRARY["scale"][type][attribute]["speech"];
  }

  return SCALE_LIBRARY["scale"][type][attribute];
}

// get a human-readable name like 'C sharp' for a request
export function humanNameScreen(attribute: string, type: string): string {
  if (type === "key") {
    return SCALE_LIBRARY["scale"][type][attribute]["readable"];
  }

  return SCALE_LIBRARY["scale"][type][attribute];
}

// respond with intro speech and a scale
export function speechScaleResponse(
  computedScale: ScaleAttributes,
  requestedScale: ScaleAttributes
) {
  const scaleSpeech = `${randomSpeech(ACKNOWLEDGE)} ${randomSpeech(
    HERE_IS
  )} ${humanName(computedScale.key, "key")} ${humanName(
    computedScale.mode,
    "mode"
  )}`;

  let modifierSpeech = "";
  if (requestedScale.octave) {
    modifierSpeech = `${modifierSpeech}, ${humanName(
      computedScale.octave,
      "octave"
    )}`;
  }

  if (requestedScale.speed) {
    modifierSpeech = `${modifierSpeech}, ${humanName(
      computedScale.speed,
      "speed"
    )}`;
  }
  return scaleSpeech + modifierSpeech + ".";
}

export function computeScaleFilename(computedScale: ScaleAttributes) {
  const tempos = { slow: "60_crotchet", normal: "120", fast: "160" };

  // scale_E_natural_minor_1o_120

  const scaleFilename = `scale_${computedScale.key}_${computedScale.mode}_${
    computedScale.octave
  }o_${tempos[computedScale.speed]}.mp3`;

  return scaleFilename;
}

export function scaleAudioResponse(
  computedScaleAttributes: ScaleAttributes
): string {
  const ssmlBreak = `<break time="1.5s"/>`;

  const audioTag = `<audio src="${
    CONSTANTS.CONFIG.SCALE_AUDIO_URL_PREFIX
  }${computeScaleFilename(computedScaleAttributes)}" />`;

  let speech = `${ssmlBreak} ${audioTag} ${audioTag} ${ssmlBreak}`;

  if (computedScaleAttributes.speed === "slow") {
    speech = `${ssmlBreak} ${audioTag} ${ssmlBreak}`;
  }

  return speech;
}

export function getDefaultScaleAttributes(): ScaleAttributes {
  return {
    key: "C",
    mode: "major",
    speed: "normal",
    octave: "1"
  };
}
