import App from './app';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();

window.zafClient = client;

client.on('app.registered', function(data) {
  var location = data.context.location;

  new App(client, data);

  if (location === 'background') {
    setTimeout(function() {
      client.get('instances').then(function(instances) {
        Object.keys(instances.instances).forEach(function(instanceKey) {
          if (instances.instances[instanceKey].location === 'talk_popover') {
            client.instance(instanceKey).invoke('preloadPane');
          }
        });
      });
    }, 100);
  }

  if (location === 'top_bar' || /_sidebar$/.test(location)) {
    client.invoke('resize', { height: '500px' });
  }
});
