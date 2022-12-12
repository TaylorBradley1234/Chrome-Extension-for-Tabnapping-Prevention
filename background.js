var startImg = '';
var endImg = '';
var startTabId = 0;
var message = new Array();
var focus = true;

chrome.action.onClicked.addListener((tab) => {
	
	startTabId = tab.id;
	console.log("Start Tab ID: ", startTabId);

    chrome.tabs.captureVisibleTab(async (dataUrl) => {
    	message.push(dataUrl);

    });
});

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        // read `newIconPath` from request and read `tab.id` from sender
        console.log(msg);

        chrome.action.setIcon({
            path: msg.newIconPath,
            tabId: sender.tab.id
        });
    }
);

function endScreenshot(tab){
	chrome.tabs.get(tab.tabId, function(info){
		console.log(info.id);
		chrome.tabs.captureVisibleTab(async (dataUrl) => {
			endImg = dataUrl;
			message.push(endImg);

			chrome.tabs.sendMessage(
    			info.id, 
    			{screenshots : message},
    			function(response){
    				//console.log("response :", response);
    				chrome.tabs.create({ 
    					url: response.link},
    					function(tab2){
    						chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    							if (changeInfo.status == "loading"){
        							var url = tab.url;
        							var iconPath = "red_icon.png"
        							chrome.action.setIcon({tabId: tabId, path: iconPath});
    							}
							});
    					});
    			});

			console.log(message);
		});
	});
}


chrome.tabs.onActivated.addListener(
	function(info){
		if (info.tabId == startTabId){
			console.log("back to original tab");
			focus = true;

			setTimeout(function(){
				endScreenshot(info);
			}, 100);

		}
		else{
			focus = false;
		}
		console.log(focus);				
});

