var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	https = require('https'),
	http = require('http'),
	bodyParser = require('body-parser')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function(request, response) {
  response.render('index.html')
});
app.post("/test", function(request, response){
	console.log(request.body);
	//console.log(request);
	response.send()
});
/*BEGIN API READERS*/
app.get('/getSetup', function(request, response){
	/*INPUTS are ?PID=123,124,125&CID=123*/

	var examineeFile = fs.readFileSync(__dirname + "/public/data/Examinee.json");
	var phaseFile = fs.readFileSync(__dirname + "/public/data/Phase.json");
	var formConsentFile = fs.readFileSync(__dirname + "/public/data/FormConsent.json");
	var formConsent = JSON.parse(formConsentFile);
	var examineeReturn;
	/*Determine whether or not consent exists */
	var examineeTable = JSON.parse(examineeFile);

	var paramPhases = request.body.PID.split(",");
	var phasesNeeded = [];

	examineeTable.forEach(function(examinee){
		if (examinee.CandidateID+"" == request.body.CID && examinee.NoConsentForm == 1 && paramPhases.indexOf(""+examinee.PhaseID)>=0){
			phasesNeeded.push(examinee.PhaseID);
			examineeReturn = {FirstName: examinee.FirstName, LastName: examinee.LastName};
		}
	});
	/* INTERATE THROUGH PHASES, FIND THE CORRECT ID's AND PUSH TO LIST But only if the consent form exists */
	if(phasesNeeded.length >= 1){
		var phaseTable = JSON.parse(phaseFile);
		var returnList = [];
		phasesNeeded.forEach(function(PID){
			phaseTable.forEach(function(phase){
				if(phase.PhaseID == PID){
					returnList.push({PhaseID: phase.PhaseID, PhaseName: phase.PhaseName, PhaseLanguageID: phase.PhaseLanguageID});
				}
			});
		});
		var forms = [];
		formConsent.forEach(function(form){
			if(""+form.formTypeID == request.body.FT){
				forms.push(form);
			}
		});
		response.send({phases: returnList, examinee: examineeReturn, terms: forms})
	} else {
		response.send({error: "CANDIDATE CONSENT ALREADY EXISTS"})
	}
	/*I need either response that returns an object with two keys (phases and examinee). Else I need a responses that has an error key*/
});
app.post('/getGenericList',function(request, response){
	/*This endpoint takes a lookup code and returns a lookup object which has the attributes of code and values*/
	/*I'm sending a non case-sensitive code as a string. ?s=profession*/
	console.log(request.body);
	var lookupCodeFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupCodes.json");
	var lookupValueFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupValues.json");

	var codeTable = JSON.parse(lookupCodeFile);
	var valueTable = JSON.parse(lookupValueFile);
	var keys = request.body.s.toLowerCase().split(',');
	console.log("Key count is: " + request.body.s.toLowerCase().split(',').length);
	var Lookups = {};
/*We've read the files, parsed the JSON, and set up our Lookup object that we want to fill up*/
	console.log("The keys are: " + keys.join('|'));
	keys.forEach(function(key){
		var temp_lookup = {};
		codeTable.forEach(function(code){
			if(code.CodeDescription.toLowerCase() == key){
				temp_lookup["code"] = code;
				var temp_values = [];
				valueTable.forEach(function(value){
					if(value.LkpCode == code.LkpCode){
						temp_values.push(value);
					}
				});
				temp_lookup["values"] = temp_values;
				Lookups[code.CodeDescription] = temp_lookup;
			}
		});
	});
	response.send(Lookups)


});
app.get('/getListValuesByPhaseID', function(request, response){
	var PhaseServiceFile = fs.readFileSync(__dirname + "/public/data/PhaseService.json");
	var PhaseDiagnosisFile = fs.readFileSync(__dirname + "/public/data/PhaseDiagnosis.json");
	var LookupCodeFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupCodes.json");
	var LookupValueFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupValues.json");
	var phaseIDs = request.body.PID.split(',');
	//var lookups = request.body.lookup.split(',');
	var phase_services = JSON.parse(PhaseServiceFile);
	var phase_diagnosises = JSON.parse(PhaseDiagnosisFile);
	var lookup_values = JSON.parse(LookupValueFile);
	var return_phases = [];
	phaseIDs.forEach(function(phaseID){
			/*setup temp obj */
			var tempObj = {phaseID: phaseID, lookups: {Diagnosis: [],Service: []}};

			/*lookup for service*/
			phase_services.forEach(function(phase_service){
				if(""+phase_service.PhaseID == phaseID){
					lookup_values.forEach(function(lookup_value){
						if(lookup_value.LkpValue == phase_service.ServiceLKPValue){
							tempObj.lookups.Service.push(lookup_value);
						}
					});
				}
			});
			/*lookup for diagnosis*/
			phase_diagnosises.forEach(function(phase_diagnosis){
				if(""+phase_diagnosis.PhaseID == phaseID){
					lookup_values.forEach(function(lookup_value){
						if(lookup_value.LkpValue == phase_diagnosis.DiagnosisLKPValue){
							tempObj.lookups.Diagnosis.push(lookup_value);
						}
					});
				}
			});

			/*push tempObj to return phases*/
			return_phases.push(tempObj);
	});
	response.send(return_phases);
});
app.get('/getQuestions', function(request, response){
	/*Here we're passing a list of phases. I'm sending ?PID=123,124,125*/

	/*First we read the files, parse, and split the querystring into an array of phaseID strings */
	var PhaseFormFile = fs.readFileSync(__dirname + "/public/data/PhaseForm.json");
	var PhaseFormTypeFile = fs.readFileSync(__dirname + "/public/data/PhaseFormType.json");
	var PhaseFormQuestionFile = fs.readFileSync(__dirname + "/public/data/PhaseFormQuestion.json");
	var PhaseQuestionFile = fs.readFileSync(__dirname + "/public/data/PhaseQuestion.json");
	var PhaseQuestionResponseFile = fs.readFileSync(__dirname + "/public/data/PhaseQuestionResponse.json");
	var phase_forms = JSON.parse(PhaseFormFile);
	var phase_form_types = JSON.parse(PhaseFormTypeFile);
	var phase_form_questions = JSON.parse(PhaseFormQuestionFile);
	var phase_questions = JSON.parse(PhaseQuestionFile);
	var phase_question_responses = JSON.parse(PhaseQuestionResponseFile);
	var phaseIDs = request.body.PID.split(',');
	var formID = request.body.FT;
	var question_sets = [];
	var phaseFormTypeIDs = [];
	var return_phases = [];
	/*for each phase ID passed as query parameter*/
	phaseIDs.forEach(function(phaseID){
		/*for each phase_form in the phase_forms array*/
		phase_forms.forEach(function(phase_form){
			/*find the PhaseFormTypeID of the phase_form object whose phaseID and FormTypeID matches*/
				if(""+phase_form.PhaseID == phaseID && ""+phase_form.FormTypeID == formID){
					/*go through all the phase form questions*/
					var temp_phase = {PhaseID: phase_form.PhaseID, FormTypeID: phase_form.FormTypeID, questions: [] };

						phase_form_questions.forEach(function(phase_form_question){
							/* if the phase form question's phaseformtypeid matches the previous loop cyle, go through the phase questions using that phasequestionID*/

							if(phase_form_question.PhaseFormTypeID == phase_form.PhaseFormTypeID){
								phase_questions.forEach(function(phase_question){
									/*if the phase_question's phase questionID's match from phase form question*/
									if(phase_question.PhaseQuestionID == phase_form_question.PhaseQuestionID){
											var tempObj = phase_question;
											tempObj.PhaseQuestionResponses = [];
											phase_question_responses.forEach(function(phase_question_response){
												if(tempObj.PhaseQuestionID == phase_question_response.PhaseQuestionID){
														tempObj.PhaseQuestionResponses.push(phase_question_response);
												}
											});
											temp_phase.questions.push(tempObj);
									}
								});
							}
						});
						return_phases.push(temp_phase);
				}
		});
	});
	response.send(return_phases);

});
/*BEGIN API WRITER */
app.get('/saveExaminee', function(request, response){

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
