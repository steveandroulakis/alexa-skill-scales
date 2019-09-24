"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://medium.com/@equisept/simplest-typescript-with-visual-studio-code-e42843fe437
const scale_library_json_1 = __importDefault(require("./scale_library.json"));
// if attribute exists in the library (e.g. don't ask for 4 octaves)
function validAttribute(attribute, type) {
    return attribute in scale_library_json_1.default["scale"][type];
}
// based on defaults, what's saved for the user and what they requested
function computeScaleAttributes(scaleAttributeSet) {
    const scaleAttributes = {
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
function remainingScaleAttributes(computedAttributes) {
    const rmAttrs = [];
    // tslint:disable-next-line:forin
    for (const key in computedAttributes) {
        if (!validAttribute(computedAttributes[key], key)) {
            rmAttrs.push({ key: key, input: computedAttributes[key] });
        }
    }
    return rmAttrs;
}
// get a human-readable name like 'C sharp' for a request
function humanName(attribute, type) {
    if (type === "key") {
        return scale_library_json_1.default["scale"][type][attribute]["speech"];
    }
    return scale_library_json_1.default["scale"][type][attribute];
}
exports.humanName = humanName;
// respond with intro speech and a scale
function speechScaleResponse(computedScale, requestedScale) {
    const scaleSpeech = `Playing ${humanName(computedScale.key, "key")} ${humanName(computedScale.mode, "mode")}`;
    let modifierSpeech = "";
    if (requestedScale.octave) {
        modifierSpeech = `${modifierSpeech}, ${humanName(computedScale.octave, "octave")}`;
    }
    if (requestedScale.speed) {
        modifierSpeech = `${modifierSpeech}, ${humanName(computedScale.speed, "speed")}`;
    }
    return scaleSpeech + modifierSpeech + ".";
}
function computeScaleFilename(computedScale) {
    const tempos = { slow: "60", normal: "120", fast: "160" };
    // scale_E_natural_minor_1o_120
    const scaleFilename = `scale_${computedScale.key}_${computedScale.mode}_${computedScale.octave}o_${tempos[computedScale.speed]}.mp3`;
    return scaleFilename;
}
function getDefaultScaleAttributes() {
    return {
        key: undefined,
        mode: "major",
        speed: "normal",
        octave: "1"
    };
}
exports.getDefaultScaleAttributes = getDefaultScaleAttributes;
/// -----------------------------------------------------------------------------
const defaultScaleAttributes = {
    key: undefined,
    mode: "major",
    speed: "normal",
    octave: "1"
};
const savedScaleAttributes = {
    key: "D",
    mode: "natural_minor",
    speed: "normal",
    octave: "2"
};
const requestScaleAttributes = {
    key: "E",
    mode: undefined,
    speed: "fast",
    octave: undefined
};
const attributes = {
    defaultScaleAttributes: defaultScaleAttributes,
    savedScaleAttributes: savedScaleAttributes,
    requestScaleAttributes: requestScaleAttributes
};
const computedScaleAttributes = computeScaleAttributes(attributes);
const output = remainingScaleAttributes(computedScaleAttributes);
console.log(output);
console.log(speechScaleResponse(computedScaleAttributes, attributes.requestScaleAttributes));
console.log(computeScaleFilename(computedScaleAttributes));
function scaleSuggestion(attribute) {
    return `${randomScaleAttribute("key")} ${randomScaleAttribute("mode")}`;
}
exports.scaleSuggestion = scaleSuggestion;
console.log(scaleSuggestion("key"));
const keyTest = "E.";
if (keyTest.match(/^[AEF]/i)) {
    // alphabet letters found
    console.log("found");
}
// export function randomScaleAttribute(attribute: string): string {
//   const scaleLibrary = SCALE_LIBRARY["scale"][attribute];
//   const keys = Object.keys(scaleLibrary);
//   const rand = Math.floor(Math.random() * keys.length);
//   console.log(keys.length);
//   console.log(rand);
//   return scaleLibrary[keys[rand]];
// }
// for suggestions
function randomScaleAttribute(attribute) {
    const scaleLibrary = scale_library_json_1.default["scale"][attribute];
    const keys = Object.keys(scaleLibrary);
    const rand = Math.floor(Math.random() * keys.length);
    return humanName(keys[rand], attribute);
}
exports.randomScaleAttribute = randomScaleAttribute;
function randomKey() {
    const scaleLibrary = scale_library_json_1.default["scale"]["key"];
    const keys = Object.keys(scaleLibrary);
    const rand = Math.floor(Math.random() * keys.length);
    return keys[rand];
}
exports.randomKey = randomKey;
console.log(randomScaleAttribute("key"));
console.log(randomKey());
//# sourceMappingURL=test.js.map