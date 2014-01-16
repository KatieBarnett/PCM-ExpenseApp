/**
 * 
 */


var EmailLog = (function() {
	return {
		init : function(tid) {
			console.log("EmailLog :: init");
			
			var emailUL = document.getElementById("EmailList");

			DB.getEmailLogs(tid, function(data){
				
				// Build email history 
				for(var i=0; i<data.length; i++){
					// Populate email history list as a inner list for each email & date pair
					// TODO: uncomment inner list creation and fix css so it displays correctly 
//					var emailLI = document.createElement("li");
//					var emailLI_UL = document.createElement("ul");
					var emailLI_UL_LI1 = document.createElement("li");
					emailLI_UL_LI1.appendChild(document.createTextNode("Email: " + " " + data[i].email));
					emailUL.appendChild(emailLI_UL_LI1); // Change to emailULLI.appendChild
					var emailLI_UL_LI2 = document.createElement("li");
					emailLI_UL_LI2.appendChild(document.createTextNode("Date: " + " " + data[i].processDate));
					emailUL.appendChild(emailLI_UL_LI2); // Change to emailULLI.appendChild
//					emailLI.appendChild(emailLI_UL);
//					emailUL.appendChild(emailLI);
				}
				$('#EmailList').listview('refresh');
				
			});
			
			
			$('#cancel').on('click', function() {
				Utils.goBackWithAnimation();
			});
		}
	};
}());