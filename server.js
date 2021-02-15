'use strict';

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = 'bd424240247a4feb8e0166c3c9782e23';
const endpoint = 'https://jo2417.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

const facesImageURL = 'https://i2-prod.mirror.co.uk/incoming/article14334083.ece/ALTERNATES/s810/3_Beautiful-girl-with-a-gentle-smile.jpg';

function computerVision()
{

  async.series([
    async function () 
        {   // Analyze URL image.
            console.log('Analyzing faces in image...', facesImageURL.split('/').pop());
            // Get the visual feature for 'Faces' only.
            const faces = (await computerVisionClient.analyzeImage(facesImageURL, { visualFeatures: ['Faces'] })).faces;
            // Formats the bounding box
            function formatRectFaces(rect) {
            return `top=${rect.top}`.padEnd(10) + `left=${rect.left}`.padEnd(10) + `bottom=${rect.top + rect.height}`.padEnd(12)
                + `right=${rect.left + rect.width}`.padEnd(10) + `(${rect.width}x${rect.height})`;
            }
            // Print the bounding box, gender, and age from the faces.
            if (faces.length)
                {
                    console.log(`${faces.length} face${faces.length == 1 ? '' : 's'} found:`);
                    for (const face of faces) 
                    {
                        console.log(`    Gender: ${face.gender}`.padEnd(20)
                        + ` Age: ${face.age}`.padEnd(10) + `at ${formatRectFaces(face.faceRectangle)}`);
                    }
                }
            else 
                { console.log('No faces found.');}
        },
    function () {
      return new Promise((resolve) => {
        resolve();
      })
    }
  ], (err) => {
    throw (err);
  });
}

computerVision();



