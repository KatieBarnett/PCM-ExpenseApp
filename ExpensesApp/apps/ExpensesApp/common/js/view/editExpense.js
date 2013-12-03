/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var EditExpense = (function() {
	return {
		init : function(expenseID) {
			console.log("EditExpense :: init");

			DB.getExpense(expenseID, function(expense) {
				
				console.log(expense);
				//draw thumbNail with receipt
				Utils.getThumbNail(expense["receipt"], document.getElementById('receiptThumb'));
			    
			    $('#receiptThumb').on('click', function(){
			    	Utils.getFullImage(0, ExpenseType);
			    });
			    
			    expenseUL = document.getElementById("expenseDetailsList");
			    expenseLI = document.createElement("li");
			    expenseLI.setAttribute("class", "expenseType");
			    expenseA = document.createElement("a");
			    expenseA.appendChild(document.createTextNode(expense["expenseTypeID"]));
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
			    expenseA.appendChild(document.createTextNode(expense["accountProjectCode"]));
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
			    expenseA.appendChild(document.createTextNode(expense["tripID"]));
			    expenseLI.appendChild(expenseA);
			    expenseUL.appendChild(expenseLI);
			    
			    $('#expenseDetailsList').trigger('create');
			    $('#expenseDetailsList').listview('refresh');
			    
			    // Move to selected screen
				$('.expenseType').on('click', function() {
					Utils.loadPageWithAnimation("expenseType", function() {
						Utils.saveCurrentPageObject(EditExpense);
						ExpenseType.init(expenseID);
					});
				});
				
				$('.expenseCharge').on('click', function() {
					Utils.loadPageWithAnimation("chargeTo", function() {
						Utils.saveCurrentPageObject(EditExpense);
						ChargeTo.init(expenseID);
					});
				});
				
				$('.expenseTrip').on('click', function() {
					Utils.loadPageWithAnimation("selectTrip", function() {
						Utils.saveCurrentPageObject(EditExpense);
						SelectTrip.init(expenseID);
					});
				});
			});
			

			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			$('.deleteExpense').on('click',function() {
				DB.deleteExpense(expenseID, function() {
					Utils.loadPageWithAnimation('mainPage', function() {
						Utils.saveCurrentPageObject(EditExpense);
						MainPage.init();
					});
				});
			});

			
			
		}
	};
}());



