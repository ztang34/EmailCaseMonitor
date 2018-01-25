function getCaseNumber(){
	
	//get case information from tsdata
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done (function(data, textStatus, jqXHR){
		
		//initiate variable to keep number of new cases in support queue
		var caseNumber = 0;
		
		//initiate dicitionary to keep track of case number and its link
		var caseLink = {};
		
		for (var i =0; i < data.length; i++)
		{	
			//only count new case in support queue
			if (data[i]['status'] == 'New'&& data[i]['queue'] == 'Support'){
				caseNumber ++;
				
				//create notification when case duration is less than refresh rate (90s)
				if (caseLife(data[i]['openDate']) < 90){
					createNotification(data[i]);
					caseLink[data[i]['number']] = data[i]['link'];
				}
				
			}
		}
		
		//use extension badge to show case number
		chrome.browserAction.setBadgeText({text: caseNumber.toString()});
		
		//attach listener to notification to open its case in a new tab
		chrome.notifications.onClicked.addListener(function cb(notificationId){
			chrome.tabs.create({url: caseLink[notificationId]});
			
			//remove listener to avoid duplicate tabs opening
			chrome.notifications.onClicked.removeListener(cb);
		})
	})
	.fail(function(jqxHR, textStatus, errorThrown){
		console.log(errorThrown.toString());
	})
}

//function to create notification, notification id is the case number
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
//function to calculate case duration
function caseLife(openDate){
	var opentime = new Date(openDate);
	var currenttime = new Date();
	var elapsedtime = (currenttime-opentime)/1000;
	
	return elapsedtime;
}

//get case info every 30 s
setInterval(getCaseNumber, 30000);


