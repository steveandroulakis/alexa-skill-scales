import { HandlerInput } from "ask-sdk";
import { IntentRequest, dialog, er } from "ask-sdk-model";
import Fuse from "fuse.js";
import metaphone from "metaphone";

export function getSlotVal(handlerInput: HandlerInput, name: string) {
  const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
  const currentIntent = intentRequest.intent;

  let slotValue = null;

  if ("slots" in intentRequest.intent) {
    for (const slotName of Object.keys(intentRequest.intent.slots)) {
      const currentSlot = currentIntent.slots[slotName];

      if (currentSlot.name !== name) {
        continue;
      }

      slotValue = currentSlot.value;
    }
  }

  return slotValue;
}

export function getSlotID(handlerInput: HandlerInput, name: string) {
  const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
  const currentIntent = intentRequest.intent;

  let slotID = null;

  if ("slots" in intentRequest.intent) {
    for (const slotName of Object.keys(intentRequest.intent.slots)) {
      const currentSlot = currentIntent.slots[slotName];

      if (currentSlot.name !== name) {
        continue;
      }

      if (
        currentSlot.resolutions &&
        currentSlot.resolutions.resolutionsPerAuthority[0]
      ) {
        if (
          currentSlot.resolutions.resolutionsPerAuthority[0].status.code ===
          "ER_SUCCESS_MATCH"
        ) {
          if (
            currentSlot.resolutions.resolutionsPerAuthority[0].values.length >=
            1
          ) {
            currentSlot.resolutions.resolutionsPerAuthority[0].values.forEach(
              element => {
                slotID = element.value.id;
              }
            );
          }
        }
      }
    }
  }

  return slotID;
}

// see: https://developer.amazon.com/docs/custom-skills/use-dynamic-entities-for-customized-interactions.html
export function dynamicEntitiesFromValues(
  slotName: string,
  values: string[]
): dialog.DynamicEntitiesDirective {
  const dynamicValues: er.dynamic.Entity[] = [];

  for (const v of values) {
    const dynamicValue: er.dynamic.Entity = {
      name: {
        value: v
      }
    };

    dynamicValues.push(dynamicValue);
  }

  const types: er.dynamic.EntityListItem[] = [
    {
      name: slotName,
      values: dynamicValues
    }
  ];

  const replaceEntityDirective: dialog.DynamicEntitiesDirective = {
    type: "Dialog.UpdateDynamicEntities",
    updateBehavior: "REPLACE",
    types: types
  };

  return replaceEntityDirective;
}

function fuzzy_match_metaphone(
  searchTerm,
  searchKey,
  resultKey,
  metaphoneList
) {
  const options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.2,
    location: 0,
    distance: 10,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [searchKey]
  };
  const fusesearch = new Fuse(metaphoneList, options); // "list" is the item array
  const searchMetafone = metaphone(searchTerm);

  // because the search loves 1 letter metafones too much!
  if (searchMetafone.length < 2) {
    return null;
  }

  const result: any = fusesearch.search(searchMetafone);

  // UNCOMMENT ME TO SEE ALL THE DATA
  // console.log('METAPHONE SEARCH');
  // console.log(searchMetafone);
  // console.log(result);

  if (result.length > 0) {
    const topResult = result[0];

    return topResult.item[resultKey];
  }

  return null;
}

function fuzzy_match(searchTerm, searchKey, resultKey, slotValueList) {
  const options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.6,
    location: 0,
    distance: 2,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [searchKey]
  };
  const fusesearch = new Fuse(slotValueList, options); // "list" is the item array

  // because the search loves 1 letter metafones too much!
  // if (searchMetafone.length < 2) {
  //     return null;
  // }

  const result: any = fusesearch.search(searchTerm);

  // UNCOMMENT ME TO SEE ALL THE DATA
  // console.log('PLAIN TEXT SEARCH');
  // console.log(searchTerm);
  // console.log(result);

  // if we found a result at all
  if (result.length > 0) {
    let lowest = 100;
    let bestMatch = result[0].item[resultKey];

    // because fuze biases towards matching more syllables
    // find the lowest difference in number of letters
    for (const r of result) {
      const match = r.item[resultKey];

      const diffLength = Math.abs(searchTerm.length - match.length);

      if (diffLength < lowest) {
        lowest = diffLength;
        bestMatch = match;
      }
    }

    return bestMatch;
  }

  return null;
}

export function findClosestSlot(searchTerm, slotList) {
  function convertToMetaphoneList(slotValueList) {
    const personNames = [];
    for (const value of slotValueList) {
      const metaphoneValue = metaphone(value);

      personNames.push({
        slotValue: value,
        slotValueMetaphone: metaphoneValue
      });
    }
    return personNames;
  }

  const metaphoneList = convertToMetaphoneList(slotList);

  const resultMetaphone = fuzzy_match_metaphone(
    searchTerm,
    "slotValueMetaphone",
    "slotValue",
    metaphoneList
  );
  const resultPlain = fuzzy_match(
    searchTerm,
    "slotValue",
    "slotValue",
    metaphoneList
  );

  // return a result, whichever algo is satisfactory (metaphone or not)
  return resultMetaphone || resultPlain;
}
