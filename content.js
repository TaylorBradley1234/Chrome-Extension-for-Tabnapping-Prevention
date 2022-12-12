var startImg = "";
var endImg = "";

chrome.runtime.onMessage.addListener(
	function(msg, sender, sendResponse){

		startImg = msg.screenshots[0];
		endImg = msg.screenshots[1];

		resemble(startImg).compareTo(endImg).onComplete(function(data){
			let diff = data.misMatchPercentage;
			console.log(diff);
			let imglink = data.getImageDataUrl();

			if (diff > 0){
				chrome.runtime.sendMessage({ "newIconPath" : "/red_icon.png"});
			}
			sendResponse({ link: imglink });
			//sendResponse({ status: "done"});
		});

		return true;
	}
);