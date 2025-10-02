'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'YOUR_ALEXA_SKILL_APP_ID';
const SKILL_NAME = 'Alexa Skill';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
var accessToken = 'Please    ajay again';
var accountNameMIRF = 'Please provide the account name';
var accName = 'Account Name not specified. Please try again.';
var firstCall = 'true';
var interactionId = "";
var FINALLY = "";

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const data = [
    'A year on Mercury is just 88 days long.',
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {

    'LaunchRequest': function () {

        console.log('Here');
        this.emit('GetNewFactIntent');
    },

    'Unhandled': function() {
      console.log('in the unhadeled function');
      this.emit(':ask', 'Hmm I am not sure. Can you please provide me more details.');
      this.emit('PlannedInteraction');
    },

    'GetNewFactIntent': function () {
        console.log('@@@@@@@ ENTRY GetNewFactIntent method');
        console.log('@@@@@ FINALLY value: ',FINALLY);
        //console.log('OOOOOOOOOOOOOOOOOOOO@@@@@ alexa value: ',alexa);
        var self = this;
        var alexaAnnounce = '';
        //const tokenn = this.$request.getAccessToken();
        //console.log('@@@@@@@ GetNewFactIntent method with token',tokenn);
        var options = {
        method: 'POST',
        // TODO: Replace with your Salesforce OAuth endpoint and credentials
        // Use environment variables or AWS Secrets Manager for production
        url: 'https://YOUR_INSTANCE.salesforce.com/services/oauth2/token?grant_type=password&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&username=YOUR_USERNAME&password=YOUR_PASSWORD',
        };
        
        
        
        request(options, function (error, response, body) {
        //console.log('@@@@@@@@@@@@@ ENTRY getnewfactintentfunction POST request function');
        if (error) throw new Error(error);
        
        
        
        body=JSON.parse(body);
        // console.log('@@@@ response',response);
        // console.log('@@@@ body',body);
        accessToken = body.access_token;
        //console.log('@@@@@@@@@ accessToken : ',accessToken);
        // self.emit(':ask', 'Hi! Mayank Welcome to Veeva. How may I help you?');
        
        
        
        //self.emit(':tell', 'PlannedInteractions');
        //console.log('@@@@@@@@@@@@@ EXIT getnewfactintentfunction POST request function');
        });
        
        var options2 = {
        method: 'GET',
        url: 'https://YOUR_INSTANCE.salesforce.com/services/apexrest/interaction_details/YOUR_INTERACTION_ID',
        headers:
        {
        // authorization: 'OAuth '+accessToken,
        authorization: 'OAuth '+FINALLY,
        'content-type': 'application/json'
        },
        
        
        
        };
        
        
        
        
        request(options2, function (error, response, body) {
        console.log('@@@@@@@@@@@@@ Entry getnewfactintentfunction GET request function');
        console.log('@@@@ finally response',response);
        if (error) throw new Error(error);
        body=JSON.parse(body);
        console.log('@@@@ body finally: ',body);
        console.log('@@@@ finally account info : ',body.Account_vod__r['Name']);
        console.log('@@@@ finally account info : ',body.Account_vod__r.Name);
        var dateString=format_time(body.Call_Datetime_vod__c);
        //alexaAnnounce = 'You have only one planned call ajay, Sharing the Output :'+body.Account_vod__c;
        
        
        
        // self.emit(':ask', 'Hi! Mayank Welcome to Veeva. How may I help you with plannedInteraction?');
        //alexaAnnounce = 'You have only one planned call ajay, with '+body.account_vod__r.Formatted_Name_vod__c + 'on' + body.Call_Date_vod__c;
        
        alexaAnnounce = 'You have only one planned call ajay on ' + dateString + ' with ' +body.Account_vod__r.Name;
        self.emit(':ask', alexaAnnounce);
        });
        console.log('@@@@@@@ EXIT GetNewFactIntent GET method');
        },
    /*'GetNewFactIntent': function () {
      var self = this;
      var alexaAnnounce = '';

      var options = { method: 'POST',
        url: 'https://YOUR_INSTANCE.salesforce.com/services/oauth2/token?grant_type=password&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&username=YOUR_USERNAME&password=YOUR_PASSWORD',

          };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            body=JSON.parse(body);
            console.log(response);
            console.log('@@@@@@@@@@@@@this is getnewfactintentfunction');
            console.log(body);
            accessToken = body.access_token;
        
            console.log('@@@@@ line no 87@@@@ accessToken : ',accessToken);
           // self.emit(':ask', 'Hi! Mayank Welcome to Veeva. How may I help you?');
            
            //self.emit(':tell', 'PlannedInteractions');
          });

    //testingPlannedinterctionhit
 console.log('@@@@@ line no 94@@@@ accessToken : ',accessToken);
 console.log('@@@@@ line no 95@@@@ accessToken : ',request.accessToken);
    //var self = this;
    var options2 = { method: 'GET',
      url: 'https://YOUR_INSTANCE.salesforce.com/services/apexrest/interaction_details/YOUR_INTERACTION_ID',
      headers:
          {
            authorization: 'OAuth '+accessToken,
                'content-type': 'application/json' },

        };

        request(options2, function (error, response, body) {
          if (error) throw new Error(error);

          //body=JSON.parse(body);
          console.log(response);
          console.log('this is PLANNEDINTERACTION');
          console.log(body);
          //accessToken = body.access_token;
      
          console.log('@@@@@ line no 115@@@@ accessToken : ',accessToken);
          body=JSON.parse(body);

          console.log('@@@@@@@line no 120 @@@@@@',body);
          console.log('@@@@@@line no 121 @@@@',body.Account_vod__c);

          //console.log('@@@@@@ line no 119 @@@@@',body[0]);
          alexaAnnounce = 'You have only one planned call with '+body.Account_vod__c;
          
         // self.emit(':ask', 'Hi! Mayank Welcome to Veeva. How may I help you with plannedInteraction?');
         self.emit(':ask', alexaAnnounce);
          //self.emit(':tell', 'PlannedInteractions');
        });
    //testingPlannedinterctionhit




    }, */


   /* 'PlannedInteractions': function () {
      var self = this;
      self.emit(':tell', 'This is entering planned interaction');
      //var alexaAnnounce = 'There are no planned calls.';
    

      var options = { method: 'GET',
        url: 'https://YOUR_INSTANCE.salesforce.com/services/apexrest/interaction_details/YOUR_INTERACTION_ID',
        headers:
          { 'postman-token': '79f01a72-ea2f-cf68-0f82-93b3af320e38',
            'cache-control': 'no-cache',
            authorization: 'OAuth '+accessToken,
                'content-type': 'application/json' },
        body:
          { grant_type: 'password',
            client_id: 'YOUR_CLIENT_ID',
            client_secret: 'YOUR_CLIENT_SECRET',
            userName: 'YOUR_USERNAME',
            password: 'YOUR_PASSWORD',
            dateOfInteraction: this.event.request.intent.slots.Date.value
          },
       json: true
      };
      //console.log("accesstoken :",accessToken);
      var alexaAnnounce = accessToken;
      request(options, function (error, response, body) {
        console.log(alexaAnnounce);
        console.log(alexaAnnounce);
        if (error) throw new Error(error);

        body=JSON.parse(body);
        console.log(body+' and at last '+body.length);
        self.emit(':ask', alexaAnnounce);
      })
    },*/

    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

function format_time(dateTimeString) {
// formats a javascript Date object into a 12h AM/PM time string
console.log('aisa nhi h, yaha aaya h');
var date_obj = new Date(dateTimeString);
var hour = date_obj.getHours();
var minute = date_obj.getMinutes();
var amPM = (hour > 11) ? "pm" : "am";
if(hour > 12) {
  hour -= 12;
} else if(hour == 0) {
  hour = "12";
}
if(minute < 10) {
  minute = "0" + minute;
}
console.log(hour + ":" + minute + amPM);
return hour + ":" + minute + amPM;
}
const OrderCarIntentHandler = {

    //...

    handle(handlerInput){
        // This intent requires an access token so that we can get the user's
        // Ride Hailer user profile with payment information.

        // The access token is in the Context object. Access the
        // request in the HandlerInput object passed to the
        // handler.

        var accessTokenn = handlerInput.requestEnvelope.context.System.user.accessToken;
 console.log('@@@@@@@@@@@@accessTokenn 199 @@@@@@@@',accessTokenn);
        // ...
    }
};
exports.handler = function (event, context, callback) {
    
    console.log('@@@@@ ENTRY export.handler function');
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    var accessTokenalexa = context;
    FINALLY= event.session.user.accessToken;
    //console.log('@@@@@ FINALLY value: ',FINALLY);
    //console.log('@@@@@ event value: ',event);
    console.log('@@@@@ event value: ',event.session.user);
    //console.log('@@@@@ event value: ',event.session.user.accessToken);
    //console.log('@@@@@ context value: ',context);
    //console.log('@@@@@ callback value: ',callback);
    alexa.execute();
    //console.log('@@@@@ EXIT export.handler function');
	      
};
