import { defineConfig } from 'cypress'
import { config } from 'dotenv'

const env = config('./.env').parsed

export default defineConfig({
  e2e: {
    // specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: env.BASE_URL ?? 'https://dev.impresso-project.ch/app',
    // supportFile: false,
    experimentalStudio: true,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    // allow it to react to 4xx errors
    chromeWebSecurity: false,
  },
  env: {
    // NOTE: add these as environment variables in .env:
    USER_EMAIL: 'test@test.com',
    USER_PASSWORD: 'secret',
    ...env,
  }
});
