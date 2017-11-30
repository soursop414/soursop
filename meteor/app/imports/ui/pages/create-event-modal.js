import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { EventData, EventDataSchema } from '../../api/eventdata/eventdata.js';

/* eslint-disable no-param-reassign */

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
const createContext = EventDataSchema.namedContext('Create_Event_Modal');

Template.Create_Event_Modal.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = createContext;
});


Template.Create_Event_Modal.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
  EventData() {
    return EventData.find();
  },
});

Template.Create_Event_Modal.onRendered(function enableSemantic() {
  const instance = this;
  instance.$('#dependencies').dropdown();
});

Template.Create_Event_Modal.events({
  'submit .create-event-form'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.Name.value;
    const startDate = event.target.startDate.value;
    const endDate = event.target.endDate.value;
    const dependencies = $('#dependencies').dropdown('get value');
    console.log(dependencies);

    const newEventData = { name, startDate, endDate };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    const cleanData = EventDataSchema.clean(newEventData);
    // Determine validity.
    instance.context.validate(cleanData);
    if (instance.context.isValid() && (startDate < endDate)) {
      const id = EventData.insert(cleanData);
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
      $('#create-event-modal').modal('hide');
      $('#dependencies').dropdown('clear');
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
