function getCaseNumber(){
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done (function(data, textStatus, jqXHR){
		var caseNumber = 0;
		for (var i =0; i < data.length; i++)
		{
			if (data[i]['status'] == 'New'){
				caseNumber ++;
				createNotification(data[i]);
			}
		}
		chrome.browserAction.setBadgeText({text: caseNumber.toString()});
	})
	.fail(function(jqxHR, textStatus, errorThrown){
		console.log(errorThrown.toString());
	})
}

function createNotification(caseInfo){
	var options = {
		type: 'basic',
		iconUrl: 'pionemail.jpg',
		title: 'New Case in Queue!',
		message: caseInfo['Summary']
	};
	
	chrome.notifications.create(caseInfo['number'], options, function(id){
		
	})
}

setInterval(getCaseNumber, 30000);
