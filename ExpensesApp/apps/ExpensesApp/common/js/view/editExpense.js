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
			    	Utils.getFullImage(expense.receipt, expenseID, ExpenseType);
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
			    if (expense["accountProjectCode"] == "null" || expense["accountProjectCode"] == null ){
			    	expenseA.appendChild(document.createTextNode("Unknown"));
			    } else {
			    expenseA.appendChild(document.createTextNode(expense["accountProjectCode"]));
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
			    if (expense["tripID"]== "null" || expense["tripID"]==null){
			    	expenseA.appendChild(document.createTextNode("Unknown"));
			    } else {
			    expenseA.appendChild(document.createTextNode(expense["tripID"]));
			    }
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
			$('.deleteExpense').on('click',function() {
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



