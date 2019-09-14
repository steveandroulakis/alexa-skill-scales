# Scales

For musical instrument practice.
By Steve Androulakis (androula@amazon.com)
`amzn1.ask.skill.92b76c85-84a3-49c7-a932-28d5ef11c1a5`

# Configuration

## Install

`cd lambda/custom` first!!!

```
npm install -g serverless
npm install --development
npm i ajv
npm install @types/node --save-dev
```

## Deploy Lambda Function

First time: You may want to change the name of the Lambda function by editing `serverless.yml`

```
serverless deploy -v
```

And take note of the output..

The serverless deploy will result in an output like:

```
Stack Outputs
ExecuteLambdaFunctionQualifiedArn: arn:aws:lambda:us-west-2:293016420137:function:skill-template-typescript-dev-execute:1
```

Grab the lambda function name from the `ExecuteLambdaFunctionQualifiedArn` line:
`arn:aws:lambda:us-west-2:293016420137:function:skill-template-typescript-dev-execute`
e.g. without the `:1` at the end. And save it somewhere for later.

### Updating the function after that

```
cd lambda/custom
serverless deploy function -f execute
```

## Deploy the Skill

Remove the skill ID from the `skill_id` property in `./.ask/config`. Leave the property blank e.g. `"skill_id": ""`.

Open `./skill.json`

Replace the lambda function in `apis->custom->endpoint->uri` with your new lambda function name.

Then, from the top directory `./`.

```
ask deploy --target skill
ask deploy --target model
```

## Run Unit Tests

NOTE: The one unit test specified here isn't actually set up :)

Using `ts-jest`: `npm run test`

Tests can be found in the `lambda/custom/__tests__` directory.

## Use the skill

`Alexa, open scales`

TODO

You can find what the skill currently expects to hear by looking in `models/en-AU.json`.
