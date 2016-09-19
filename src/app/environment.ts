// The file for the current environment will overwrite this one during build
// Different environments can be found in src/environments/environment.{dev|prod}.ts
// The build system defaults to the dev environment

export const environment = {
  production: false,
  //TODO: APPARENTLY THIS IS NOT OVERLOADED WHEN BUILDING
  devHost: "http://localhost:8080",
  jwtEnabled: true
};
