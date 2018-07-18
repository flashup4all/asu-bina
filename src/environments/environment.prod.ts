export const environment = {
  production: true,
  application_name: 'ASUSU',
  api: {
  	version: '1.2',
  	url: 'http://asusuapi.asusu.ng/api/',//'http://ec2-13-59-107-189.us-east-2.compute.amazonaws.com/api/',//'http://aix.testapi.asusu.ng/api/',//
  	imageUrl: 'http://asusuapi.asusu.ng/images/',//'http://aix.testapi.asusu.ng/images/',
  	payment_gateway_live: 'https://live.moneywaveapi.co/',
  	payment_gateway_test: 'https://moneywave.herokuapp.com/',
  	payment_key: {
      apiKey: 'ts_KUZFH2U2F51RST7LJ5BZ',
      secret: 'ts_EK8NWXPIE8XUT6635ILW65UITWVGZE'
    }
  }
};
