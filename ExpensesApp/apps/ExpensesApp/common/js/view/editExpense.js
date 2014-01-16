/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var EditExpense = (function() {
	return {
		init : function(expenseID) {
			console.log("EditExpense :: init");

			DB.getExpense(expenseID, function(expense) {
			    // Get the trip description from unprocessed trip
				DB.getTrip(expense["tripID"], function(trip) {
					console.log(expense);
					//draw thumbNail with receipt
					Utils.getThumbNail(expense["receipt"], $('#editExpenseReceipt')[0]);
					
					$('.receiptThumb').on('click', function(){
						Utils.getFullImage(expense.receipt, expenseID, EditExpense);
					});
					
					expenseUL = document.getElementById("expenseDetailsList");
					expenseLI = document.createElement("li");
					expenseLI.setAttribute("class", "expenseType");
					expenseA = document.createElement("a");
					if (expense["expenseTypeID"]== "null" || expense["expenseTypeID"]==null){
					expenseA.appendChild(document.createTextNode("Unknown"));
					} else {
					    expenseA.appendChild(document.createTextNode(expense["expenseTypeID"]));
					}
					expenseLI.appendChild(expenseA);
					expenseUL.appendChild(expenseLI);
					
					expenseLI = document.createElement("li");
					expenseLI.setAttribute("data-role", "list-divider");
					expenseLI.setAttribute("data-theme", "f");
					expenseLI.appendChild(document.createTextNode("Charge to"));
					expenseUL.appendChild(expenseLI);
					
					expenseLI = document.createElement("li");
					expenseLI.setAttribute("class", "expenseCharge");
					expenseA = document.createElement("a");
					if (expense["accountProjectCode"] == "Default Accounting") {
						expenseA.appendChild(document.createTextNode(expense["accountProjectCode"]));
					} else {
						expenseA.appendChild(document.createTextNode(expense["accountProjectName"] + " (" + expense["accountProjectCode"] + ")"));
					}
					expenseLI.appendChild(expenseA);
					expenseUL.appendChild(expenseLI);
					
					expenseLI = document.createElement("li");
					expenseLI.setAttribute("data-role", "list-divider");
					expenseLI.setAttribute("data-theme", "f");
					expenseLI.appendChild(document.createTextNode("Trip"));
					expenseUL.appendChild(expenseLI);
					
					expenseLI = document.createElement("li");
					expenseLI.setAttribute("class", "expenseTrip");
					expenseA = document.createElement("a");
					
					expenseA.appendChild(document.createTextNode(trip.tripName));
					
					 expenseLI.appendChild(expenseA);
					    expenseUL.appendChild(expenseLI);
					    
					    $('#expenseDetailsList').trigger('create');
					$('#expenseDetailsList').listview('refresh');
					
					// Move to selected screen
					$('.expenseType').on('click', function() {
					Utils.loadPageWithAnimation("expenseType", expenseID, function() {
							Utils.saveCurrentPageObject(EditExpense);
							ExpenseType.init(expenseID);
						});
					});
					
					$('.expenseCharge').on('click', function() {
					Utils.loadPageWithAnimation("chargeTo", expenseID, function() {
							Utils.saveCurrentPageObject(EditExpense);
							ChargeTo.init(expenseID);
						});
					});
					
					$('.expenseTrip').on('click', function() {
					Utils.loadPageWithAnimation("selectTrip", expenseID, function() {
								Utils.saveCurrentPageObject(EditExpense);
								SelectTrip.init(expenseID);
							});
						});
					});
					
					// Navigation buttons functionality
					$('.back').on('click', function() {
						Utils.goBackWithAnimation();
					});
					
					// Attach handler to screen
					EditExpense.deleteModalHandler(expenseID);
			});
		},
		
		/**
		 * Handler for the Delete confirmation popup
		 */
		deleteModalHandler : function(expenseID) {
			// Click handler for 'Delete' button
			$('#deleteBtn').on('click', function() {
				$('.confirm').css('display', 'block');	
				$('.opacity').css('display', 'block');
				if(Utils.isiOS7()){
					$('.confirm').animate({bottom:'20px'}, 500);
				} else{
					$('.confirm').animate({bottom:'0px'}, 500);	
				}
			});
			
			// Click handler for 'No' button
			$('#noBtn').on('click', function() {				
				$('.opacity').css('display', 'none');				
				$('.confirm').animate({bottom:'-210px'}, 500, function() { 
					$(".confirm").css('display', 'none');
				});				
			});

			// Click handler for 'Yes' button
			$('#yesBtn').on('click', function() {
				
				DB.deleteExpense(expenseID, function() {
					Utils.loadPageWithAnimation('mainPage', null, function() {
						Utils.saveCurrentPageObject(EditExpense);
						MainPage.init();
					});
				});
			});
		}
	};
}());



