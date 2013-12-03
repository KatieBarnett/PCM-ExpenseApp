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
			DB.getUnassociatedExpenses(function(expenseData){
				for (var i=0; i<expenseData.length; i++){

					expenseLI = document.createElement("li");
					expenseLI.setAttribute("data-expense", expenseData[i]["expenseID"]);
					expenseLI.setAttribute("class", "expenseItem");
					expenseAnchor = document.createElement("a");

					if (expenseData[i]["expenseTypeID"] == null){
						expenseAnchor.appendChild(document.createTextNode("Please complete the expense questions"));
					} else {
						expenseAnchor.appendChild(document.createTextNode(expenseData[i]["expenseTypeID"]));
						if (expenseData[i]["accountProjectName"] != null){
							expenseAnchor.appendChild(document.createTextNode(expenseData[i]["accountProjectName"]));
							if (expenseData[j]["accountProjectCode"] != null){
								expenseAnchor.appendChild(document.createTextNode("(" + expenseData[i]["accountProjectCode"]+ ")" ));
							};
						};
					}

					receiptThumbnail = document.createElement("img");
					if (expenseData[i]["receipt"] == "null"){
						receiptThumbnail.setAttribute("src", "images//no-receipt.gif");
					} else {
						receiptThumbnail.setAttribute("src", expenseData[i]["receipt"]);
					}
					expenseAnchor.appendChild(receiptThumbnail);
					expenseLI.appendChild(expenseAnchor);
					expenseList.appendChild(expenseLI);
				};
				$('#expenseList').listview('refresh');

				// Move to next page after expense type is selected, pass expenseTypeID
				$('.expenseItem').on('click', function() {
					var expenseID = $(this).attr("data-expense");
					Utils.loadPageWithAnimation("editExpense", function() {
						Utils.saveCurrentPageObject(ProcessTrips);
						EditExpense.init(expenseID);
					});
				});
			});



			DB.getUnprocessedTrips(function(data){
				
				//Populate trip list
				var tripUL=document.getElementById("tripList");
				
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
				$('#tripList').listview('refresh');
				
				// On Selection of trip, move to next screen
				$('.tripSelected').on('click', function() {
					var selectedTrip = $(this).attr("data-trip");
					Utils.loadPageWithAnimation("tripExpenses", function() {
						Utils.saveCurrentPageObject(ProcessTrips);						
						// Pass selected 
						TripExpenses.init(selectedTrip);
					});
				});	
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

