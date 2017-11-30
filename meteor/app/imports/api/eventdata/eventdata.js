import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

/* eslint-disable object-shorthand */

export const EventData = new Mongo.Collection('EventData');

/**
 * Create the schema for EventData
 */
export const EventDataSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
  },
  startDate: {
    label: 'StartDate',
    type: Date,
  },
  endDate: {
    label: 'EndDate',
    type: Date,
  },
}, { tracker: Tracker });

EventData.attachSchema(EventDataSchema);
