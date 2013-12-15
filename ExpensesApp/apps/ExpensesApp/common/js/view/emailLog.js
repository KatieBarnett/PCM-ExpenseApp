/**
 * 
 */


var EmailLog = (function() {
	return {
		init : function(tid) {
			console.log("EmailLog :: init");
			

			DB.getEmailLogs(tid, function(data){
				
				//build email history 
				for(var i=0; i<data.length; i++){
					//Populate email history list
					$('<li>', { text : "email" + " " + data[i].email + "date" + "" + data[i].processDate }).appendTo("#EmailList");
					
					
					
				}
				$('#EmailList').listview('refresh');
				
			});
			
			
			$('#cancel').on('click', function() {
				Utils.goBackWithAnimation();
			});
		}
	};
}());