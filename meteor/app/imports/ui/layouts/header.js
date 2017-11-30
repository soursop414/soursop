import { Template } from 'meteor/templating';

Template.Header.events({
  'click .addNode': function () {
    $('#create-event-modal').modal({ blurring: true }).modal('show');
  },
});
