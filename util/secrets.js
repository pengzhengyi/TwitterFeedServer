import dotenv from "dotenv";
import fs from "fs";


if (fs.existsSync(".env")) {
  // synchronously look for .env file in file system
  console.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  console.error(".env file does not exist! Please supply a .env file");
  process.exit(1);
}

/**
 * Handle the case where a variable cannot be found in dot environment.
 *
 * Args:
 *    variableName: Name of the variable trying to resolve.
 * Returns:
 *    None, will exit.
 */
function defaultVariableNotFoundHandler(variableName) {
  console.error(`Cannot find ${variableName} in dot environment!`);
  process.exit(1);
}

/**
 * Resolves a variable by doing a lookup in dot environment.
 *
 * Args:
 *    variableName: name of the variable in production environment.
 *    variableLocalName: name of the variable in environment other than production (dev, test for example).
 *    variableNotFoundHandler: A callback function that will be invoked with the name of the variable as the only argument when the variable is not found in the dot environment.
 * Returns:
 *    The value of the variable specified by variableName in dot environment.
 */
function resolveEnvironmentVariable(
     variableName,
     variableNotFoundHandler=defaultVariableNotFoundHandler) {
  const value = process.env[variableName];
  if (value) {
    return value;
  } else {
    variableNotFoundHandler(name);
  }
}

export const CONSUMER_KEY = resolveEnvironmentVariable("CONSUMER_KEY");
export const CONSUMER_SECRET = resolveEnvironmentVariable("CONSUMER_SECRET");
export const ACCESS_TOKEN_KEY = resolveEnvironmentVariable("ACCESS_TOKEN_KEY");
export const ACCESS_TOKEN_SECRET = resolveEnvironmentVariable("ACCESS_TOKEN_SECRET");

export const ACCESS_TOKEN = resolveEnvironmentVariable("ACCESS_TOKEN");