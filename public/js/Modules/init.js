/* init.js */
/* First */
function API(service, data, options, callback){
	switch(service){
		case "getTitles":
			dataSchema = {candidateID: "", phaseID: ""};
		break;
		case "getGenericList":
			dataSchema = {lookupTables: [""]};
		break;
		case "getListValuesByPhaseID":
			dataSchema = {phaseID: "", lookupTables: [""]};
		break;
		case "getQuestions":
			dataSchema = {formType: "", phaseID: ""}
		break;
		case "saveExaminee":
			dataSchema = {examinee: {}};
		break;
	}
}