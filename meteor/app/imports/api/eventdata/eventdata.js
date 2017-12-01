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
  duration: {
    label: 'Duration',
    type: Number,
  },
  dependencies: {
    label: 'Dependencies',
    type: [String],
    optional: true,
  },
  ef: {
    label: 'EF',
    type: Number,
    optional: true,
  },
  es: {
    label: 'ES',
    type: Number,
    optional: true,
  },
  lf: {
    label: 'LF',
    type: Number,
    optional: true,
  },
  ls: {
    label: 'LS',
    type: Number,
    optional: true,
  },
  slack: {
    label: 'slack',
    type: Number,
    optional: true,
  },
}, { tracker: Tracker });

EventData.attachSchema(EventDataSchema);
