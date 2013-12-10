/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var ProcessTrips = (function() {
	return {
		init : function() {
			console.log("ProcessTrips :: init");
			
			DB.getUnassociatedExpenses(function(expenseData){
				for (var i=0; i<expenseData.length; i++){

					expenseLI = document.createElement("li");
					expenseLI.setAttribute("data-expense", expenseData[i]["expenseID"]);
					expenseLI.setAttribute("class", "unassociatedExpenseItem");
					expenseLI.setAttribute("data-icon", "none");
					expenseAnchor = document.createElement("a");
					
					receiptThumbnail = document.createElement("canvas");
					receiptThumbnail.height = '75';
					receiptThumbnail.width = '75';
					var imageObj = new Image();
					if (expenseData[i]["receipt"]){
						imageObj.src = expenseData[i]["receipt"];
						var context = receiptThumbnail.getContext('2d');
					    imageObj.onload = function(){
					        context.drawImage(imageObj, 0, 0, 75, 75);
					    };
					} else {
						imageObj.src = "images//no-receipt.gif";
						var context = receiptThumbnail.getContext('2d');
					    imageObj.onload = function(){
					        context.drawImage(imageObj, 0, 0, 75, 75);
					    };
					}
					
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

					expenseAnchor.appendChild(receiptThumbnail);
					expenseLI.appendChild(expenseAnchor);
					unassociatedExpenseList.appendChild(expenseLI);
				};
				$('#unassociatedExpenseList').listview('refresh');

				// Move to next page after expense type is selected, pass expenseTypeID
				$('.tripSelected').on('click', function() {
					var expenseID = $(this).attr("data-expense");
					Utils.loadPageWithAnimation("editExpense", null, function() {
						Utils.saveCurrentPageObject(ProcessTrips);
						EditExpense.init(expenseID);
					});
				});
				
				// Handler for when the user clicks on the unassociated item.
				$('.unassociatedExpenseItem').on('click', function() {
					var expenseID = parseInt($(this).attr("data-expense"));
					
					// Get the expense entry from the DB from the selected item
					DB.getExpense(expenseID, function(singleExpense) {
						console.log(singleExpense.expenseTypeID);
						if (singleExpense.expenseTypeID == "null") {
							// Move the user to the beginning of the process flow
							Utils.loadPageWithAnimation("expenseType", null, function() {
								Utils.saveCurrentPageObject(ProcessTrips);
								ExpenseType.init(expenseID);
							});
						} else if (singleExpense.accountProjectCode == "null") {
							// Move the user to select the charge to code
							Utils.loadPageWithAnimation("chargeTo", null, function() {
								Utils.saveCurrentPageObject(ProcessTrips);
								ChargeTo.init(expenseID);
							});
						} else if (singleExpense.tripID) {
							// Move the user to select a trip to associate the expense to
							Utils.loadPageWithAnimation("selectTrip", null, function() {
								Utils.saveCurrentPageObject(ProcessTrips);
								SelectTrip.init(expenseID);
							});
						}
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
					Utils.loadPageWithAnimation("tripExpenses", null, function() {
						Utils.saveCurrentPageObject(ProcessTrips);						
						// Pass selected 
						TripExpenses.init(selectedTrip, false);
					});
				});	
			});
			
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			$('.forward').on('click', function() {
				Utils.loadPageWithAnimation("tripExpenses", null, function() {
					Utils.saveCurrentPageObject(ProcessTrips);
					Test.init();
				});
			});
		}
	};
}());

