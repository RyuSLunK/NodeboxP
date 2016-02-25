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
	/* INTERATE THROUGH PHASES, FIND THE CORRECT ID's AND PUSH TO LIST */
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

});
app.get('/getGenericList',function(request, response){
	var lookupCodeFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupCodes.json");
	var lookupValueFile = fs.readFileSync(__dirname + "/public/data/tlkpUDLookupValues.json");

	var codeTable = JSON.parse(lookupCodeFile);
	var valueTable = JSON.parse(lookupValueFile);

	var Lookup = {code: {},values: []};

	codeTable.forEach(function(code){
		if(request.query.s.toLowerCase() == code.CodeDescription.toLowerCase()){
			Lookup.code = code;
		}
	});
	valueTable.forEach(function(value){
		if(value.LkpCode == Lookup.code.LkpCode){
			Lookup.values.push(value);
		}
	});
	if(Lookup.code.LkpCode && Lookup.values.length >= 1){
		response.send(Lookup)
	} else {
		response.send({error: "Lookup Code Description Not Found"})
	}

});
app.get('/getListValuesByPhaseID', function(request, response){
	
});
app.get('/getQuestions', function(request, response){

});
/*BEGIN API WRITER */
app.get('/saveExaminee', function(request, response){

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
