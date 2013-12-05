/**
 * 
 */


var Emails = (function() {
	return {
		init : function() {
			console.log("Emails :: init");
			// Load sample data
			/*DB.addEmail("goardd@au1.ibm.com", "01-10-13", function() {
				});
			DB.addEmail("goardd@au1.ibm.com", "25-09-13", function() {
			});
			
			*/
			
			
/* Review below for email history screen */			
			DB.getProcessedTrips(function(data){
				
				//Populate trip list
				var emailUL=document.getElementById("EmailList");
				
				for(var i=0; i<data.length; i++){
					emailLI = document.createElement("li");
					
					emailAnchor = document.createElement("a");
					emailAnchor.appendChild(document.createTextNode(data[i]["emailAddress"]));
					emailLI.setAttribute("class", "emailSelected");
					emailLI.setAttribute("data-trip", data[i]["emailID"]);
					emailLI.appendChild(emailAnchor);
					emailDates = document.createElement("p");
					emailDates.appendChild(document.createTextNode(data[i]["date"]));
					emailLI.appendChild(emailDates);
					emailUL.appendChild(emailLI);
					
					
					
					
				}
				$('#EmailList').listview('refresh');
				
				// On Selection of trip, move to next screen
				$('.emailSelected').on('click', function() {
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