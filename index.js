var express = require('express'),
	fs = require('fs'),
	path = require('path')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.render('index.html')
});

/*BEGIN API READERS*/
app.get('/getTitles', function(request, response){
	/*INPUTS are ?PID=123,124,125&CID=123*/

	var examineeFile = fs.readFileSync(__dirname + "/public/data/Examinee.json");
	var phaseFile = fs.readFileSync(__dirname + "/public/data/Phase.json");
	var examineeReturn;
	/*Determine whether or not consent exists */
	var examineeTable = JSON.parse(examineeFile);

	var paramPhases = request.query.PID.split(",");
	var phasesNeeded = [];

	examineeTable.forEach(function(examinee){
		if (examinee.CandidateID+"" == request.query.CID && examinee.NoConsentForm == 1 && paramPhases.indexOf(""+examinee.PhaseID)>=0){
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
		response.send({phases: returnList, examinee: examineeReturn})
	} else {
		response.send({error: "CANDIDATE CONSENT ALREADY EXISTS"})
	}
	/*I need either response that returns an object with two keys (phases and examinee). Else I need a responses that has an error key*/
});
app.get('/getGenericList',function(request, response){
	/*This endpoint takes a lookup code and returns a lookup object which has the attributes of code and values*/
	/*I'm sending a non case-sensitive code as a string. ?s=profession*/

	var lookupCodeFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupCodes.json");
	var lookupValueFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupValues.json");

	var codeTable = JSON.parse(lookupCodeFile);
	var valueTable = JSON.parse(lookupValueFile);

	var Lookup = {code: {},values: []};
/*We've read the files, parsed the JSON, and set up our Lookup object that we want to fill up*/
	codeTable.forEach(function(code){
		if(request.query.s.toLowerCase() == code.CodeDescription.toLowerCase()){
			Lookup.code = code;
		}
	});
	/*Now that we've found the lookup code, we're going to search the lookup value list for the object whose lookup code matches for each one we will push to an array*/
	valueTable.forEach(function(value){
		if(value.LkpCode == Lookup.code.LkpCode){
			Lookup.values.push(value);
		}
	});
	/* the lkpcode object neets to exist (needs to be found and the lookup values need to have at least one) */
	if(Lookup.code.LkpCode && Lookup.values.length >= 1){
		response.send(Lookup)
	} else {
		response.send({error: "Lookup Code Description Not Found"})
	}

});
app.get('/getListValuesByPhaseID', function(request, response){

});
app.get('/getQuestions', function(request, response){
	/*Here we're passing a list of phases. I'm sending ?PID=123,124,125*/

	/*First we read the files, parse, and split the querystring into an array of phaseID strings */
	var PhaseQuestionFile = fs.readFileSync(__dirname + "/public/data/PhaseQuestion.json");
	var PhaseQuestionResponseFile = fs.readFileSync(__dirname + "/public/data/PhaseQuestionResponse.json");
	var phase_questions = JSON.parse(PhaseQuestionFile);
	var phase_question_responses = JSON.parse(PhaseQuestionResponseFile);
	var phaseIDs = request.query.PID.split(',');
	var question_sets = [];

	/*Now we're going to loop through each phase ID string that was passed to the server*/
	phaseIDs.forEach(function(phaseID){
		var return_phase_questions = [];
		phase_questions.forEach(function(phase_question){
			if(phaseID == ""+phase_question.PhaseID){
				return_phase_questions.push(phase_question);
			}
		});
		question_sets.push(return_phase_questions);
	});

	/* Now each phase should have a set of questions. */

	question_sets.forEach(function(question_set){
		question_set.forEach(function(question){
			phase_question_responses.forEach(function(phase_question_response){
				if(question.PhaseQuestionID == phase_question_response.PhaseQuestionID){
					if(!question.PhaseQuestionResponses){
						question.PhaseQuestionResponses = [];
					}
					question.PhaseQuestionResponses.push(phase_question_response);
				}
			});
		});
	});
/* Now each question in the question set has a PhaseQuestionResponse assumming there was a match in the responses list*/
/*Send back the question sets*/
	response.send(question_sets)
});
/*BEGIN API WRITER */
app.get('/saveExaminee', function(request, response){

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
