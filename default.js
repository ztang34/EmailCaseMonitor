$(function(){

	
	$.getJSON("http://tsdata/api/cases/emailqueue")
	.done(function(data, textStatus, jqXHR){
		for (var i = 0; i<data.length; i++){
			if (data[i].status != "New" ) {
				continue;
			}
			
			data[i]['summary_id'] = "summary".concat(i);
			data[i]['title_id'] = "title".concat(i);
			
			var opentime = new Date(data[i]['openDate']);
			var currenttime = new Date();
			var elapsedtime = (currenttime-opentime)/(60*1000);
			
			
			var template = Handlebars.compile('<div class="row"><div class="col-xs-8"><a href="{{link}}" id={{title_id}}>{{summary}}</a></div><div class="col-xs-4"><span class="pull-right"><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#{{summary_id}}" style="margin-bottom:10px">Details</a></span></div></div>');
			var context = data[i];
			var case_title = template(context);
			$(".container").append(case_title);
			
			if (elapsedtime < 5){
				$('#'+data[i]['title_id']).css("color", "green");
			}
			else if (elapsedtime > 5 && elapsedtime < 30){
				$('#'+data[i]['title_id']).css("color", "yellow");
			}
			else if (elapsedtime > 30 && elapsedtime < 240){
				$('#'+data[i]['title_id']).css("color", "red");
			}
			else {
				$('#'+data[i]['title_id']).css("color", "red");
			}
			
			var notes = data[i]['notes'];
			notes = notes.slice((notes.search("x0D")+4), notes.length);
			
			
			var template = Handlebars.compile('<div id={{summary_id}} class="collapse" style= "font-style:italic; font-size: 80%"></div>');
			var context = data[i];
			var case_summary = template(context);
			$(".container").append(case_summary);
			
			$('#'+data[i]['summary_id']).html(notes);
		}
		
	})
	.fail(function(jqxHR, textStatus, errorThrown){
		console.log(errorThrown.toString());
	})
	
	$('body').on('click','a',function(){
		chrome.tabs.create({url:$(this).attr('href')});
	})
});