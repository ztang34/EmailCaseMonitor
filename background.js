function getCaseNumber(){
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done (function(data, textStatus, jqXHR){
		var caseNumber = 0;
		for (var i =0; i < data.length; i++)
		{
			if (data[i]['status'] == 'New'){
				caseNumber ++;
			}
		}
		chrome.browserAction.setBadgeText({text: caseNumber.toString()});
	})
	.fail(function(jqxHR, textStatus, errorThrown){
		console.log(errorThrown.toString());
	})
}

setInterval(getCaseNumber, 30000);
