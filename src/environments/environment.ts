// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  application_name: 'Asusu - Loan Now Pay Later',
  api: {
  	version: '1.2',
  	url: 'http://asusuapi.asusu.ng/api/',//'http://localhost:8000/api/', //'http://aix.testapi.asusu.ng/api/',//
  	imageUrl: 'http://asusuapi.asusu.ng/images/',
  	payment_gateway_live: 'https://live.moneywaveapi.co/',
  	payment_gateway_test: 'https://moneywave.herokuapp.com/',
  	payment_key: {
  		apiKey: 'ts_KUZFH2U2F51RST7LJ5BZ',
  		secret: 'ts_EK8NWXPIE8XUT6635ILW65UITWVGZE',
  	}
  }
};
