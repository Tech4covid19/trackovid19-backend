'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  let notification;

  if (event.data) {
    try {
      notification = event.data.json().notification;
    }
    catch(e) {
      console.log('Error on parse json from push message', e);
    }
  }

  if (notification) {
    event.waitUntil(
      self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon,
        badge: notification.badge,
        image: notification.image,
        //tag: tag
      })
    );
  }
});

// self.addEventListener('notificationclick', function(event) {
//   console.log('On notification click: ', event.notification.tag);
//   // Android doesn’t close the notification when you click on it
//   // See: http://crbug.com/463146
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(clients.matchAll({
//     type: 'window'
//   }).then(function(clientList) {
//     for (var i = 0; i < clientList.length; i++) {
//       var client = clientList[i];
//       if (client.url === '/' && 'focus' in client) {
//         return client.focus();
//       }
//     }
//     if (clients.openWindow) {
//       return clients.openWindow('/');
//     }
//   }));
// });