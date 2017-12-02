import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { EventData, EventDataSchema } from '../../api/eventdata/eventdata.js';

/* eslint-disable no-param-reassign */

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
const createContext = EventDataSchema.namedContext('Create_Event_Modal');

function calcDuration(date2, date1) {
  return Math.round(Math.abs((date2 - date1) / (24 * 60 * 60 * 1000)));
}

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
    const startDate = Date.parse(event.target.startDate.value);
    const endDate = Date.parse(event.target.endDate.value);
    const dependenciesValue = instance.$('#dependencies').dropdown('get value');
    const dependencies = [];
    const duration = calcDuration(startDate, endDate);

    for (let i = 0; i < dependenciesValue.length - 1; i++) {
      dependencies.push(dependenciesValue[i]);
    }

    const newEventData = { name, startDate, endDate, duration, dependencies };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    const cleanData = EventDataSchema.clean(newEventData);
    // Determine validity.
    instance.context.validate(cleanData);

    let valid = true;

    for (let i = 0; i < dependencies.length; i++) {
      try {
        if (startDate < EventData.findOne({ name: dependencies[i] }).endDate) {
          valid = false;
          Template.instance().context.addInvalidKeys([{ name: 'startDate', type: 'required', value: null }]);
        }
      } catch (e) {
        //
      }
    }
    if (instance.context.isValid() && (startDate < endDate) && valid) {
      const id = EventData.insert(cleanData);
      console.log(cleanData);
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
