/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var TripExpenses = (function() {
	return {
		_expenseData : [],
		init : function(selectedTrip) {
			console.log("TripExpenses :: init");
			
			var headingPublished = false;
			
			// Get the selected trip from the DB with the details
			TripExpenses._getTrip(selectedTrip, function(tripName, tripStart, tripEnd) {
				// Publish trip details
				TripExpenses._fillTitles(tripName, tripStart, tripEnd);
			});
			
			DB.getTripExpenses(selectedTrip, function(data) {
				// Save the expense object internally
				TripExpenses._expenseData = data;
				
				var expenseTypes = DB.getExpenseTypes();
				var expenseList = document.getElementById("expenseList");
				
				for (var i=0; i<expenseTypes.length; i++){
					for (var j=0; j<data.length; j++){
						if (expenseTypes[i]["expenseTypeID"] == data[j]["expenseTypeID"]){
							// Publish list divider for each existing expense type
							if (headingPublished == false){
								expenseLI = document.createElement("li");
								expenseLI.setAttribute("data-role", "list-divider");
								expenseLI.appendChild(document.createTextNode(expenseTypes[i]["expenseTypeID"]));
								expenseList.appendChild(expenseLI);
								headingPublished = true;
							}
							
							expenseLI = document.createElement("li");
							expenseLI.setAttribute("data-expense", data[j]["expenseID"]);
							expenseLI.setAttribute("class", "expenseItem");
							expenseAnchor = document.createElement("a");
							if (data[j]["accountProjectName"] == null){
								expenseAnchor.appendChild(document.createTextNode("Please complete the expense questions"));
							} else {
								expenseAnchor.appendChild(document.createTextNode(data[j]["accountProjectName"]));
								if (data[j]["accountProjectCode"] != null){
									expenseAnchor.appendChild(document.createTextNode("(" + data[j]["accountProjectCode"]+ ")" ));
								}
							}
							receiptThumbnail = document.createElement("img");
							if (data[j]["receipt"]){
								receiptThumbnail.setAttribute("src", "images//no-receipt.gif");
							} else {
								receiptThumbnail.setAttribute("src", data[j]["receipt"]);
							}
							expenseAnchor.appendChild(receiptThumbnail);
							expenseLI.appendChild(expenseAnchor);
							
							
							expenseList.appendChild(expenseLI);
							
							// 
						}
					}
					headingPublished = false;
					
				}
				$('#expenseList').listview('refresh');
				
				// Move to next page after expense type is selected, pass expenseTypeID
				$('.expenseItem').on('click', function() {
					var expenseID = $(this).attr("data-expense");
					Utils.loadPageWithAnimation("editExpense", selectedTrip, function() {
						Utils.saveCurrentPageObject(TripExpenses);
						EditExpense.init(expenseID);
					});
				});
			});
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			// Attach modal handler to the screen.
			TripExpenses._modalHandler(selectedTrip);
			
			// Handler for when the send details button is clicked
			$('#sendTripDetailsBtn').on('click', function() {
				$('.sendDetailsContainer').css('display','block');
				$('.sendDetailsContainer').animate({bottom:'0px'}, 500);
				
				// Handler for when the cancel button is clicked
				$('#cancelSendDetailsBtn').on('click', function() {
					$('.sendDetailsContainer').animate({bottom:'-284px'}, 500, function() { 
						$('.sendDetailsContainer').css("display","none");
					});
				});
				
				// Handler for when the submit button is clicked
				$('#submitTripDetailsBtn').on('click', function() {
					TripExpenses._sendTrip(selectedTrip);
				});
			});
			
			
		},
		
		/**
		 * Function that will attach all the handlers required by the modal. It will also
		 * grab refreshed data from the database to display to the user.
		 * @param selectedTrip the Trip ID.
		 */
		_modalHandler : function(selectedTrip) {
			$('#editTrip').on('click', function() {
				// Get the new information from the data base and then populate the fields in the modal.
				TripExpenses._getTrip(selectedTrip, function(tripName, tripStart, tripEnd) {
					// Prefil the details on the modal
					$('#editTripDescription').val(tripName);
					$('#editStartDate').val(tripStart);
					$('#editEndDate').val(tripEnd);
					
					// Bring up the modal
					$('#editTripModal').popup("open");
				});
		
				// Handler to close the popup
				$('#cancelEditTrip').on('click', function() {
					$('#editTripModal').popup("close");
				});
				
				// Handler for when the submit button is pressed
				$('#submitEditTrip').on('click', function() {
					var tripDescription = $('#editTripDescription').val();
					var tripStartDate = $('#editStartDate').val();
					var tripEndDate = $('#editEndDate').val();
					
					// Submit the update to the DB
					DB.updateTrip(selectedTrip, tripDescription, tripStartDate, tripEndDate, function() {
						// Close the modal
						$('#editTripModal').popup("close");
						
						// Clear the current title
						TripExpenses._removeTitles();
						
						// Reload the current page
						TripExpenses._fillTitles(tripDescription, tripStartDate, tripEndDate);
					});
				});
			});
		},
		
		/**
		 * Function that will clear the trip name, start and end dates on screen
		 * @param none
		 */
		_removeTitles : function() {
			$('#tripName').empty();
			$('#tripStart').empty();
			$('#tripEnd').empty();
		},
		
		/**
		 * Function that will populate the title
		 * @param tripName the title of the trip
		 * @param tripStart the start date of the trip
		 * @param tripEnd the end date of the trip
		 */
		_fillTitles : function(tripName, tripStart, tripEnd) {
			$('#tripName').html(tripName);
			$('#tripStart').html(tripStart);
			$('#tripEnd').html(tripEnd);
		},
		
		/**
		 * Function that will get the data from the DB and then will complete
		 * the call back function as specified.
		 * @param selectedTrip the trip ID
		 * @param callback the callback function
		 */
		_getTrip : function(selectedTrip, callback) {
			console.log(selectedTrip);
			DB.getUnprocessedTrip(selectedTrip, function(data) {
				var tripName = data.tripName;
				var tripStart = data.startDate;
				var tripEnd = data.endDate;
				
				if (callback) {
					callback(tripName, tripStart, tripEnd);
				}
			});
		},
		
		/**
		 * Function that will take the expense data, format it into a prefilled email for the user
		 * to send it to desired email address entered.
		 * @param selectedTrip
		 */
		_sendTrip : function(selectedTrip) {
			// Check if the email was sent properly
			var onComplete = function(returnValue) {
				// Have the alert confirm if the email was sent?
				if (returnValue > 0 && returnValue <= 3) {
					alert("Email sent");
				}
			};
			
			// Get the trip name that is being emailed.
			var emailSubject = "Expenses for " + $('#tripName').html();
			
			// Build the body of the email
			var emailBody = "Need to build the body";
			
			var emailAddress = $('#sendTripEmailAddress').val();
			if (emailAddress.length > 1) {
				/*
				 * To use the email composer plugin, the following arguments are as follows:
				 * showEmailComposerWithCallback(callback, subject, body, to, cc, bcc, boolean HTML, attachments)
				 */
				window.plugins.emailComposer.showEmailComposerWithCallback(
						onComplete,
						emailSubject, 
						emailBody, 
						[emailAddress],
						[],
						[],
						true,
						[]);
			}
			
			
			
		}
	};
}());

