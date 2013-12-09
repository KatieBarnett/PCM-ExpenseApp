/**
 * This is the JavaScript controller for the history page
 */

var History = (function() {
	return {
		init : function() {
			console.log("History :: init");
			
			/* Review below for history screen */			
			DB.getProcessedTrips(function(data){
				
				//Populate trip list
				var tripUL=document.getElementById("historyList");
				
				for(var i=0; i<data.length; i++){
					tripLI = document.createElement("li");
					
					tripAnchor = document.createElement("a");
					tripAnchor.appendChild(document.createTextNode(data[i]["tripName"]));
					tripLI.setAttribute("class", "tripSelected");
					tripLI.setAttribute("data-trip", data[i]["tripID"]);
					tripLI.appendChild(tripAnchor);
					tripDates = document.createElement("p");
					tripDates.appendChild(document.createTextNode(data[i]["startDate"]));
					tripDates.appendChild(document.createTextNode("/"));
					tripDates.appendChild(document.createTextNode(data[i]["endDate"]));
					tripLI.appendChild(tripDates);
					tripUL.appendChild(tripLI);
				}
				$('#historyList').listview('refresh');
				
				// On Selection of trip, move to next screen
				$('.tripSelected').on('click', function() {
					var selectedTrip = $(this).attr("data-trip");
					Utils.loadPageWithAnimation("tripExpenses", null, function() {
						Utils.saveCurrentPageObject(History);						
						// Pass selected 
						TripExpenses.init(selectedTrip, true);
					});
				});	
			});
			
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
		}
	};
}());

