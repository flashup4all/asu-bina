// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  application_name: 'Asusu - Loan Now Pay Later',
  api: {
  	version: '1.2',
  	url: /*'https://asusu.herokuapp.com/api/',*//*'http://asusuapi.asusu.ng/api/',*/'http://localhost:8000/api/',
  	imageUrl: 'http://asusuapi.asusu.ng/images/',
  	payment_gateway_live: 'https://live.moneywaveapi.co/',
  	payment_gateway_test: 'https://moneywave.herokuapp.com/'
  }
};
