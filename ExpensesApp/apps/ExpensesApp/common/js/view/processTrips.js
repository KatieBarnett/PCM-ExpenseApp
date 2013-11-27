/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var ProcessTrips = (function() {
	return {
		init : function() {
			console.log("ProcessTrips :: init");
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
			*/
			
			DB.getUnprocessedTrips(function(data){
				
				//Populate trip list
				var tripUL=document.getElementById("tripList");
				
				for(var i=0; i<data.length; i++){
					tripLI = document.createElement("li");
					tripLI.setAttribute("data-trip", data[i]["tripID"]);
					tripAnchor = document.createElement("a");
					tripAnchor.appendChild(document.createTextNode(data[i]["tripName"]));
					tripAnchor.setAttribute("class", "tripSelect");
					tripLI.appendChild(tripAnchor);
					tripDates = document.createElement("p");
					tripDates.appendChild(document.createTextNode(data[i]["startDate"]));
					tripDates.appendChild(document.createTextNode("/"));
					tripDates.appendChild(document.createTextNode(data[i]["endDate"]));
					tripLI.appendChild(tripDates);
					tripUL.appendChild(tripLI);
					
					$('#tripList').listview('refresh');
					
					// On Selection of trip, move to next screen
					$('.tripSelect').on('click', function() {
						Utils.loadPageWithAnimation("tripExpenses", function() {
							Utils.saveCurrentPageObject(processTrips);
							alert(this.getAttribute("data-trip"));
							// Save selection here - to be done
							TripExpenses.init();
						});
					});	
				}
			});
			
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			$('.forward').on('click', function() {
				Utils.loadPageWithAnimation("tripExpenses", function() {
					Utils.saveCurrentPageObject(ProcessTrips);
					Test.init();
				});
			});
		}
	};
}());

