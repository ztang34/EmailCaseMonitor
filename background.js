//initiate a global variable to keep track of each new case number and its link
var caseLink = {};

function getCaseNumber(){
	
	//get case information from tsdata
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done (function(data, textStatus, jqXHR){
		
		//initiate variable to keep number of new cases in support queue
		var caseNumber = 0;
		
		for (var i =0; i < data.length; i++)
		{	
			//only count new case in support queue
			if (data[i]['status'] == 'New'&& data[i]['queue'] == 'Support'){
				caseNumber ++;
				
				//create notification when case duration is less than refresh rate (60s)
				if (caseLife(data[i]['openDate']) < 120){
					createNotification(data[i]);
					audioNotification();
					caseLink[data[i]['number']] = data[i]['link'];
				}
				
			}
		}
		
		//use extension badge to show case number
		chrome.browserAction.setBadgeText({text: caseNumber.toString()});
		
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

//call back function for the onClick listener, create new tab for each case
function notificationcb (notificationId){
	chrome.tabs.create({url: caseLink[notificationId]});
}

//function to calculate case duration
function caseLife(openDate){
	var opentime = new Date(openDate);
	var currenttime = new Date();
	var elapsedtime = (currenttime-opentime)/1000;
	
	return elapsedtime;	
}

function audioNotification(){
	var sound = new Audio('new_case_sound.mp3');
	sound.play();
}


//get case info every 30 s
setInterval(getCaseNumber, 30000);

//attach listener to notification to open its case in a new tab
chrome.notifications.onClicked.addListener(notificationcb);




