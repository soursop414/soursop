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

Template.Create_Event_Modal.onRendered(function enableSemantic() {
  const instance = this;
  instance.$('#example2').calendar({ type: 'date' });
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
});


Template.Create_Event_Modal.events({
  'submit .create-event-form'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.Name.value;
    // Get level (radio buttons, exactly one)
    const month = event.target.Month.value;
    const day = event.target.Day.value;
    const year = event.target.Year.value;
    const duration = event.target.Duration.value;
    const date = `${year}-${month}-${day}`;

    const newEventData = { name, date, duration };
    console.log(newEventData);
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    const cleanData = EventDataSchema.clean(newEventData);
    // Determine validity.
    instance.context.validate(cleanData);
    if (instance.context.isValid()) {
      console.log('valid');
      const id = EventData.insert(cleanData);
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
      instance.$('.dropdown').dropdown('restore defaults');
    } else {
      console.log('not valid');
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
