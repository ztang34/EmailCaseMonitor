$(function(){

	//get case from queue from tsdata
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done(function(data, textStatus, jqXHR){
		
		//initiate a variable to count total number of cases skipped and compared it with total number of case in the queue
		var skippedCase = 0;
		
		//loop through each case
		for (var i = 0; i<data.length; i++){
			
			//skipped case not new or not in support queue
			if (data[i]['status'] != 'New' || data[i]['queue'] != 'Support' ) {	
				skippedCase++;
				continue;
			}
			
			//add new key-value pair for the id of case summary and case id
			data[i]['summary_id'] = "summary".concat(i);
			data[i]['title_id'] = "title".concat(i);
			
			//create case title
			var template = Handlebars.compile('<div class="row"><div class="col-xs-8"><a href="{{link}}" id={{title_id}}>{{summary}}</a></div><div class="col-xs-4"><span class="pull-right"><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#{{summary_id}}" style="margin-bottom:10px">Details</a></span></div></div>');
			var context = data[i];
			var case_title = template(context);
			$(".container").append(case_title);
			
			//change case color based on case duration in queue
			caseDurationColor(data[i]);
			
			//get case summary from tsdata
			var notes = data[i]['notes'];
			notes = notes.slice((notes.search("x0D")+4), notes.length);
			
			//create case summary division
			var template = Handlebars.compile('<div id={{summary_id}} class="collapse" style= "font-style:italic; font-size: 80%"></div>');
			var context = data[i];
			var case_summary = template(context);
			$(".container").append(case_summary);
			
			//add case summary to inner html of summary division
			$('#'+data[i]['summary_id']).html(notes);
		}
		
		//show message when no new case in support queue
		if (skippedCase == data.length){
			var noCase = '<div class="row"><div class="col-xs-12">No case in support queue right now</div>'
			$(".container").append(noCase);
		}
		
	})
	.fail(function(jqxHR, textStatus, errorThrown){
		console.log(errorThrown.toString());
	})
	
	//attach listener to case summary to open case in a new tab
	$('body').on('click','a',function(){
		chrome.tabs.create({url:$(this).attr('href')});
	})
});

//function to calculate case duration and change case title color
function caseDurationColor(caseInfo){
	var opentime = new Date(caseInfo['openDate']);
	var currenttime = new Date();
	var elapsedtime = (currenttime-opentime)/(60*1000);
	
	if (elapsedtime < 5){
		$('#'+ caseInfo['title_id']).css("color", "green");
		}
	else if (elapsedtime > 5 && elapsedtime < 30){
			$('#'+ caseInfo['title_id']).css("color", "orange");
			}
	else if (elapsedtime > 30 && elapsedtime < 240){
			$('#'+ caseInfo['title_id']).css("color", "red");
			}
	else {
			$('#'+ caseInfo['title_id']).css("color", "black");
		}
	
	
}



