/**
 * This is the JavaScript controller for the history page
 */

var History = (function() {
	return {
		init : function() {
			console.log("History :: init");
			
			/* Review below for history screen */			
			DB.getProcessedTrips(function(data){
				
				if (data.length > 0) {
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
						if (data[i]["startDate"]) {				
							tripDates.appendChild(document.createTextNode(data[i]["startDate"]));						
						}
						if (data[i]["startDate"] && data[i]["endDate"]) {
							tripDates.appendChild(document.createTextNode("/"));
						} else if (!data[i]["startDate"] && !data[i]["endDate"]) {
							tripDates.appendChild(document.createTextNode("No trip dates specified."));
						}
						if (data[i]["endDate"]) {
							tripDates.appendChild(document.createTextNode(data[i]["endDate"]));
						}
						tripLI.appendChild(tripDates);
						tripUL.appendChild(tripLI);
					}
					$('#historyList').listview('refresh');
				} else {
					$("#historyList").removeClass("ui-shadow");
					$("#historyList li:first-child").addClass("ui-shadow");
					$("#noTripsMsg").removeClass("hidden");
				}	
				
				// On Selection of trip, move to next screen
				$('.tripSelected').on('click', function() {
					var selectedTrip = $(this).attr("data-trip");
					Utils.loadPageWithAnimation("tripExpenses", null, function() {
						Utils.saveCurrentPageObject(History);						
						// Pass selected 
						TripExpenses.init(selectedTrip);
					});
				});	
			});
			
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
		}
	};
}());

