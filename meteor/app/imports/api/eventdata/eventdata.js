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
  start: {
    label: 'Start',
    type: Date,
  },
  duration: {
    label: 'Duration',
    type: Number,
  },
}, { tracker: Tracker });

EventData.attachSchema(EventDataSchema);
