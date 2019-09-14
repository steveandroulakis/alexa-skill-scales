import { skill, ssml, RequestWithType } from "../test_helpers";
import { RequestTypes, LocaleTypes } from "../helpers/constants";

// taken from https://github.com/Xzya/alexa-typescript-starter/tree/master/__tests__

// NODE: this doesn't work right now because I'm not using mock-dynamo
describe("Launch", () => {
  it("should work", async () => {
    const response = await skill(
      RequestWithType({
        type: RequestTypes.Launch,
        locale: LocaleTypes.enAU
      })
    );
    expect(response).toMatchObject(ssml(/Welcome to ?/gi));
  });
});
