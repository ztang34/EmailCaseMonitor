function getCaseNumber(){
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done (function(data, textStatus, jqXHR){
		var caseNumber = 0;
		var caseLink = {};
		
		for (var i =0; i < data.length; i++)
		{
			if (data[i]['status'] == 'New'&& data[i]['queue'] == 'Support'){
				caseNumber ++;
				
				if (caseLife(data[i]['openDate']) < 30){
					createNotification(data[i]);
					caseLink[data[i]['number']] = data[i]['link'];
				}
				
			}
		}
		chrome.browserAction.setBadgeText({text: caseNumber.toString()});
		
		chrome.notifications.onClicked.addListener(function(notificationId){
			chrome.tabs.create({url: caseLink[notificationId]});
		})
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
		message:caseInfo['summary']
	};
	
	chrome.notifications.create(caseInfo['number'], options, function(notificationId){
		
	})
	
}

function caseLife(openDate){
	var opentime = new Date(openDate);
	var currenttime = new Date();
	var elapsedtime = (currenttime-opentime)/1000;
	
	return elapsedtime;
}

setInterval(getCaseNumber, 30000);


