// https://medium.com/@equisept/simplest-typescript-with-visual-studio-code-e42843fe437
import SCALE_LIBRARY from "./scale_library.json";

interface ScaleAttributeSet {
  defaultScaleAttributes: ScaleAttributes;
  savedScaleAttributes: ScaleAttributes;
  requestScaleAttributes: ScaleAttributes;
}

interface AttributeInput {
  key: string;
  input: string;
}

interface ScaleAttributes {
  key: string;
  mode: string;
  speed: string;
  octave: string;
}

// if attribute exists in the library (e.g. don't ask for 4 octaves)
function validAttribute(attribute: string, type: string): boolean {
  return attribute in SCALE_LIBRARY["scale"][type];
}

// based on defaults, what's saved for the user and what they requested
function computeScaleAttributes(scaleAttributeSet: ScaleAttributeSet) {
  const scaleAttributes: ScaleAttributes = {
    key: undefined,
    mode: undefined,
    speed: undefined,
    octave: undefined
  };

  // tslint:disable-next-line:forin
  for (const key in scaleAttributeSet.defaultScaleAttributes) {
    scaleAttributes[key] =
      scaleAttributeSet.requestScaleAttributes[key] ||
      scaleAttributeSet.savedScaleAttributes[key] ||
      scaleAttributeSet.defaultScaleAttributes[key];
  }

  return scaleAttributes;
}

// can we fulfill the request? did the user request something invalid?
function remainingScaleAttributes(
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
function humanName(attribute: string, type: string): string {
  return SCALE_LIBRARY["scale"][type][attribute];
}

// respond with intro speech and a scale
function speechScaleResponse(
  computedScale: ScaleAttributes,
  requestedScale: ScaleAttributes
) {
  const scaleSpeech = `Playing ${humanName(
    computedScale.key,
    "key"
  )} ${humanName(computedScale.mode, "mode")}`;

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

function computeScaleFilename(computedScale: ScaleAttributes) {
  const tempos = { slow: "80", normal: "120", fast: "160" };

  // scale_E_natural_minor_1o_120

  const scaleFilename = `scale_${computedScale.key}_${computedScale.mode}_${
    computedScale.octave
  }o_${tempos[computedScale.speed]}.mp3`;

  return scaleFilename;
}

export function getDefaultScaleAttributes(): ScaleAttributes {
  return {
    key: undefined,
    mode: "major",
    speed: "normal",
    octave: "1"
  };
}

/// -----------------------------------------------------------------------------

const defaultScaleAttributes: ScaleAttributes = {
  key: undefined,
  mode: "major",
  speed: "normal",
  octave: "1"
};

const savedScaleAttributes: ScaleAttributes = {
  key: "D",
  mode: "natural_minor",
  speed: "normal",
  octave: "2"
};

const requestScaleAttributes: ScaleAttributes = {
  key: "E",
  mode: undefined,
  speed: "fast",
  octave: undefined
};

const attributes: ScaleAttributeSet = {
  defaultScaleAttributes: defaultScaleAttributes,
  savedScaleAttributes: savedScaleAttributes,
  requestScaleAttributes: requestScaleAttributes
};

const computedScaleAttributes = computeScaleAttributes(attributes);

const output = remainingScaleAttributes(computedScaleAttributes);

console.log(output);

console.log(
  speechScaleResponse(
    computedScaleAttributes,
    attributes.requestScaleAttributes
  )
);

console.log(computeScaleFilename(computedScaleAttributes));

export function scaleSuggestion(attribute: string): string {
  return `${randomScaleAttribute("key")} ${randomScaleAttribute("mode")}`;
}

console.log(scaleSuggestion("key"));

const keyTest = "E.";
if (keyTest.match(/^[AEF]/i)) {
  // alphabet letters found
  console.log("found");
}

export function randomScaleAttribute(attribute: string): string {
  const scaleLibrary = SCALE_LIBRARY["scale"][attribute];
  const keys = Object.keys(scaleLibrary);

  const rand = Math.floor(Math.random() * keys.length);

  console.log(keys.length);
  console.log(rand);

  return scaleLibrary[keys[rand]];
}

console.log(randomScaleAttribute("key"));
