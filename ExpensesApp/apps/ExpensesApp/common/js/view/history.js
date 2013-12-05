/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var History = (function() {
	return {
		init : function() {
			console.log("History :: init");
			// Load sample data
			/*DB.addTrip("Melbourne ANZ", "01-10-13", "03-10-13", function() {
				});
			DB.addTrip("ANZ Pitt St Meeting", "25-09-13", "25-09-13", function() {
			});
			DB.addTrip("NCEVER Adelaide Go Live Meeting", "27-09-13", "27-09-13", function() {
			});
			DB.addTrip("Canberra DoD RFD", "10-09-13", "10-09-13", function() {
			});
			DB.addTrip("Melbourne ANZ", "07-09-13", "13-09-13", function() {
			});
			DB.addTrip("Melbourne ANZ", "01-09-13", "13-09-13", function() {
			});
			DB.addExpense("Public Transportation", "1DHTA", "images\\receipt-placeholder.gif", 4, function() {
				console.log("added expense");
			});
			DB.addExpense("Public Transportation", "1DHTY", "images\\receipt-placeholder1.gif", 4, function() {
				console.log("added expense");
			});
			DB.addExpense("Hotel", null, "images\\no-receipt.gif", 4, function() {
				console.log("added expense");
			});		
			
			DB.addClientCode("1DHTA", "ANZ", "1DHTA", function() {
				console.log("added expense");
			});
			DB.addClientCode("1DHTY", "CBA", "1DHTY", function() {
				console.log("added expense");
			});
			DB.addClientCode("1DHTH", "NCVER", "1DHTH", function() {
				console.log("added expense");
			});
			*/
			
			
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
						Utils.saveCurrentPageObject(ProcessTrips);						
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

