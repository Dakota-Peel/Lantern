'use strict';
//ASSOCIATED WITH LOGGING IN
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOAD_DELAY = 'LOAD_DELAY';
export const LOAD_EMERGENCY_CONTACT = 'LOAD_EMERGENCY_CONTACT'; 

//ASSOCIATED WITH GETTING LOCATION
export const GET_CURRENT_LOCATION = 'GET_CURRENT_LOCATION';
export const GET_CURRENT_LOCATION_SUCCESS = 'GET_CURRENT_LOCATION_SUCCESS';
export const GET_CURRENT_LOCATION_FAIL = 'GET_CURRENT_LOCATION_FAIL'

//ASSOCIATED WITH CREATING A NEW TRIP
export const ADD_START = 'ADD_START';
export const ADD_DESTINATION = 'ADD_DESTINATION';
export const ADD_ETA = 'ADD_ETA';


//ASSOCIATED WITH BEING ENROUTE
export const START_TRIP = 'START_TRIP';
export const CHECK_IN = 'CHECK_IN';
export const ADD_WAYPOINT = 'ADD_WAYPOINT';
export const LOAD_TRIP = 'LOAD_TRIP';


//ASSOCIATED WITH TIMELINESS
export const PASSED_ACCEPTABLE_DELAY = 'PASSED_ACCEPTABLE_DELAY';
export const PASSED_ETA = 'PASSED_ETA';
export const RESET_DELAY = 'RESET_DELAY';

//ASSOCIATED WITH UPDATING USER SETTINGS
export const UPDATE_EMERGENCY_CONTACT = 'UPDATE_EMERGENCY_CONTACT';
export const UPDATE_ACCEPTABLE_DELAY = 'UPDATE_ACCEPTABLE_DELAY'

//ASSOCIATED WITH AUTHENTICATION
export const AUTHENTICATE = 'AUTHENTICATE';
