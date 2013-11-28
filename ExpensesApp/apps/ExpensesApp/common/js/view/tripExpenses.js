/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var TripExpenses = (function() {
	return {
		init : function(selectedTrip) {
			console.log("TripExpenses :: init");
			console.log(selectedTrip);
			
			var tripName = null;
			var tripStart = null;
			var tripEnd = null;
			var headingPublished = false;
			/*
			DB.updateExpense("7", "Public Transportation", "1DHTA", "images//receipt-placeholder.gif", 4, function(){
				
			});
			DB.updateExpense("8", "Public Transportation", "1DHTY", "images//receipt-placeholder1.gif", 4, function(){
				
			});
			DB.updateExpense("9", "Hotel", null, null, 4, function(){
	
			});
			*/
			// Retrieve and publish trip details
			DB.getUnprocessedTrips(function(data){
			
				for(var i=0; i<data.length; i++){
					if (data[i]["tripID"]==selectedTrip){
						tripName = data[i]["tripName"];
						tripStart = data[i]["startDate"];
						tripEnd = data[i]["endDate"];
					}
				}
				// Publish trip details
				var tripDetailsField = document.getElementById("tripName");
				tripDetailsField.appendChild(document.createTextNode(tripName));
				tripDetailsField = document.getElementById("tripStart");
				tripDetailsField.appendChild(document.createTextNode(tripStart));
				tripDetailsField = document.getElementById("tripEnd");
				tripDetailsField.appendChild(document.createTextNode(tripEnd));
				
			});
			
			DB.getTripExpenses(selectedTrip, function(data) {
				
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
							if (data[j]["receipt"] == "null"){
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
				
				console.log(data);
			});
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			$('.forward').on('click', function() {
				Utils.loadPageWithAnimation("test", function() {
					Utils.saveCurrentPageObject(TripExpenses);
					Test.init();
				});
			});
			
			$('#plusButton').on('click', function() {
				console.log("Function called");
				$('#descriptionErrorMsg').addClass('hidden');  
				$("#addTripModal").popup("open");
				
				
				$('#submitAddTrip').on('click', function() {
					if ($('#tripDescription').val().length > 1) {
						console.log("Submit button clicked");
						var tripDescription = $('#tripDescription').val();
						var	startDate = $('#startDate').val();
						var	endDate = $('#endDate').val();
							
						var callback = function() {
							$("#addTripModal").popup("close");
						};
	
						DB.addTrip(tripDescription, startDate, endDate, callback);
						
					} else {
						console.log("empty text box detected");
						$('#descriptionErrorMsg').removeClass('hidden');  
					}
				});
				
				
				$('#cancelAddTrip').on('click', function(){
				    console.log("close modal");
				    $("#addTripModal").popup("close");
				});
			
			});
		}
	};
}());

