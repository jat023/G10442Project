var findSecBugsxml;
var dependenciesXml;
var apk_name;

function loadXML(){
	console.log("Trying to load XML");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.status == 200 || xmlhttp.status == 0) && xmlhttp.readyState == 4){
			findSecBugsxml = xmlhttp.responseText; //Can do automatically!
			showfindSecBugsXML(findSecBugsxml);
			console.log(findSecBugsxml);
		}
	};
	xmlhttp.open("GET","xml/fbreport.xml",true);
	xmlhttp.send();
	
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.onreadystatechange = function(){
		if(xmlhttp2.status == 200 && xmlhttp2.readyState == 4){
			dependenciesXml = xmlhttp2.responseText;
			//console.log(dependenciesXml);
			showDependenciesXML(dependenciesXml);
		}
	};
	xmlhttp2.open("GET","xml/DCreport0001.xml",true);
	xmlhttp2.send();
	//Will do it with XML once I get the file
	
	var xmlhttp3 = new XMLHttpRequest();
	xmlhttp3.onreadystatechange = function (){
		if((xmlhttp3.status == 200 || xmlhttp3.status == 0) && xmlhttp3.readyState == 4){
			console.log(xmlhttp3.responseText);
			apk_name = xmlhttp3.responseText;
			$("#app-info").text("Showing Security Issues for " + apk_name);

		}
	};
	xmlhttp3.open("GET","xml/apkname.txt",true);
	//xmlhttp3.responseType = "text";
	xmlhttp3.send();
}


//Currently just logging stuff
function showfindSecBugsXML(xml){
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(xml, 'text/xml');
	$("#security-issues").empty();

	var bugs = xmlDoc.getElementsByTagName("BugInstance")
	for (var bug of bugs){
		//console.log(bugs[x]);//.getAttribute("type"));
		var rank = bug.getAttribute("rank");
		var type = bug.getAttribute("type");


		if (bug.getAttribute("type") != "NM_CLASS_NAMING_CONVENTION" && bug.getAttribute("instanceOccurrenceNum") == 0){
			var hash = bug.getAttribute("instanceHash");
			var childrenNodes = bug.childNodes;
			var bugClassName;
			var bugClassGivenName;

			//console.log(childrenNodes);
			var justDoIt = true;
			for (var check of childrenNodes){
				if (check.nodeName == "Class"){
					if (check.getAttribute("primary") == "true"){
						bugClassGivenName = bugClassName = check.getAttribute("classname");
						bugClassName = bugClassName.replace(/\./g, "-").replace(/\$/g, '-');
					}
					if(check.getAttribute("classname").indexOf("android.") > -1){
						justDoIt = false;					
					}
				}
			}
			if (justDoIt){
				
				for (var check of childrenNodes){	
					if (check.nodeName == "ShortMessage"){
						var severity = Math.floor(rank/5);

						if ($('.'+bugClassName).length == 0){
							$("#security-issues").append("<div style='border-radius: 5px; border: 1px solid black; padding: 5px; margin: 3px;' class='" + bugClassName + "'><div style='cursor:pointer; font-size:larger;'  data-toggle='collapse' data-target='." + bugClassName +"-info'> <span class='bold'>Class:</span> " + bugClassGivenName + " <span class='badge' id='" + bugClassName + "-numBugs'>1</span></br> <span id='"+bugClassName +"MostSevere' class='MostSevereBugClass'></span></div></div>");
						}
						$('.'+bugClassName).append("<div id='" + bugClassName + "' style='cursor:default;padding: 3px; border-radius: 5px;margin: 3px;border: 1px solid black;' data-rank=" + rank + " class='" + bugClassName + "Bug-" + hash +  " " + bugClassName +"-info collapse'><div style='cursor:pointer;' data-toggle='collapse' data-target='." + bugClassName +"Bug-" + hash + "-info'><span class='bold'>Bug: </span>" + check.textContent +"</div><div class='" + bugClassName + "Bug-" + hash + "-info collapse'><span class='bold'>Type: </span>" + type + "</br><span class='bold'>Severity:</span> <span class='severity'>" + severity + "</span></div></div>");

					}
					
					if (check.nodeName == "LongMessage"){
						$('.' + bugClassName + "Bug-" + hash + "-info").append("<div><span class='bold'>Description:</span> " + check.textContent + "</div>");
					}
					if (check.nodeName == "Method" && check.getAttribute("primary") == "true"){
						$('.' + bugClassName + "Bug-" + hash + "-info").append("<div><span class='bold'> Method: </span>" + check.textContent + "</div>");
					}
					if (check.nodeName == "Field" && check.getAttribute("primary") == "true"){
						$('.' + bugClassName + "Bug-" + hash + "-info").append("<div><span class='bold'> Field: </span>" + check.textContent + "</div>");
					}					
				}
				var minimum = 20;
				var count = 0;
				$('.'+bugClassName + "-info").each(function() {
				  var value = parseFloat($(this).attr('data-rank'));
				  count++;
				  //console.log(value);
				  minimum = (value < minimum) ? value : minimum;
				});
				$('#'+bugClassName + "MostSevere").text(minimum);
				$('#'+bugClassName + "-numBugs").text(count);
			}

		}
		
	}
	$('.severity').each(function(){
		var severityNumber = $(this).text();
		if (severityNumber == "0"){
			$(this).text("Highest");
			$(this).parent().parent().css('background-color', '#ff3232');
		}
		if (severityNumber == "1"){
			$(this).text("High");
			$(this).parent().parent().css('background-color', '#ff4c4c');

		}
		if (severityNumber == "2"){
			$(this).text("Medium");
			$(this).parent().parent().css('background-color', '#ff6666');

		}
		if (severityNumber == "3" || severityNumber == "4"){
			$(this).text("Low");
			$(this).parent().parent().css('background-color', '#ff7f7f');

		}
	});
	
	$('.MostSevereBugClass').each(function(){
		var severityNumber = Math.floor(parseInt($(this).text())/5);
		if (severityNumber == 0){
			$(this).text("Highest bug severity rating: Highest");
			$(this).parent().parent().css('background-color', '#ff9932');
		}
		if (severityNumber == 1){
			$(this).text("Highest bug severity rating: High");
			$(this).parent().parent().css('background-color', '#ffa64c');

		}
		if (severityNumber == 2){
			$(this).text("Highest bug severity rating: Medium");
			$(this).parent().parent().css('background-color', '#ffb366');

		}
		if (severityNumber == 3 || severityNumber == 4){
			$(this).text("Highest bug severity rating: Low");
			$(this).parent().parent().css('background-color', '#ffbf7f');

		}
	});		
	
}

function showDependenciesXML(){
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(dependenciesXml, 'text/xml');
	var dependancies = xmlDoc.getElementsByTagName("dependency");
	$("#dependency-issues").empty();
	for (var dependancy of dependancies){
		var childrenNodes = dependancy.childNodes;
		
		for (var node of childrenNodes){
			if (node.nodeName == "fileName"){
				file = node.textContent;
				$("#dependency-issues").append("<div class='file-name'> </div>");
				//console.log(node.textContent);
			}
			if (node.nodeName == "vulnerabilities"){
				var vulnerabilities = node.childNodes;
				//console.log(vulnerabilities);
				var vulnerabilityNum = 0;
				for (var vulnerability of vulnerabilities){
					var attributes = vulnerability.childNodes;
					//console.log(attributes.length);
					if (attributes.length > 0){
						$(".file-name").append("<div style='border-radius: 5px; padding: 3px; margin: 3px;' class='vulnerability vulnerability-"+ vulnerabilityNum + "'></div>");
						for (var attribute of attributes){
							if (attribute.nodeName == "name"){
								$('.vulnerability-' + vulnerabilityNum).append("<span class='vulnerability-codename-" + vulnerabilityNum+"'>(" + attribute.textContent + ") </span>");
							}

							if (attribute.nodeName == "cwe"){
								//console.log(file);
								$('.vulnerability-' + vulnerabilityNum).append("<div style='cursor:pointer;font-size:larger;' class='vulnerability-name-" + vulnerabilityNum + "'data-toggle='collapse' data-target='#vulnerability-description-"+vulnerabilityNum +"'>" + attribute.textContent + "</div>");
								if ($('.vulnerability-codename-'+ vulnerabilityNum).length){
									var vulnerability_codename = $('.vulnerability-codename-'+ vulnerabilityNum).text();
									//console.log(vulnerability_codename);
									$('.vulnerability-codename-'+ vulnerabilityNum).remove();
									$('.vulnerability-name-' + vulnerabilityNum).append(" " + vulnerability_codename);
									
								}
								//console.log(attribute.textContent);
							}
							if (attribute.nodeName == "severity"){
								$('.vulnerability-' + vulnerabilityNum).append("<span class='vulnerability-severity-" + vulnerabilityNum + "'>" + attribute.textContent + "</span>");
								//console.log(attribute.textContent);
								if (attribute.textContent == "Low"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff7f7f');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 1);

								}
								if (attribute.textContent == "Medium"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff6666');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 2);

								}
								if (attribute.textContent == "High"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff4c4c');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 3);

								}
								if (attribute.textContent == "Highest"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff3232');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 4);

								}
							}
							if (attribute.nodeName == "description"){

								$('.vulnerability-' + vulnerabilityNum).append("<div class='vulnerability-description-" + vulnerabilityNum + " collapse' id='vulnerability-description-" +vulnerabilityNum +"'><span style='font-weight:bold'>Description: </span>" + attribute.textContent + "</div>");
								
								if ($('.vulnerability-severity-'+ vulnerabilityNum).length){
									var vulnerability_severity = $('.vulnerability-severity-'+ vulnerabilityNum).text();
									$('.vulnerability-severity-'+ vulnerabilityNum).remove();
									$('.vulnerability-description-' + vulnerabilityNum).prepend("<span style='font-weight:bold'>Severity: </span>" + vulnerability_severity + "</br>");
									
								}						
							}
							
							if (attribute.nodeName == "references"){
								var references = attribute.childNodes;
								var numReferences = 1;
								$('.vulnerability-description-' + vulnerabilityNum).append("<div class='vulnerability-references-" + vulnerabilityNum+"'>References regarding this vulnerability can be found here: </div>");
								for (var reference of references){
									var referenceAttributes = reference.childNodes;
									
									for (var attr of referenceAttributes){
										if (attr.nodeName == "url"){
											$('.vulnerability-references-' + vulnerabilityNum).append("<a target='_blank' href='" + attr.textContent + "'>[" + numReferences + "]</a>");
										}
									}
									if (referenceAttributes.length > 0 ){
										numReferences++;
									}
								}
								
							}
						}
						vulnerabilityNum++;
					}
				}
			}
		}
		
		
	}
   var sorted_vulnerabilities = $('.vulnerability').sort(function (a, b) {
      var contentA =parseInt( $(a).attr('data-severity'));
      var contentB =parseInt( $(b).attr('data-severity'));
      return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
   });
  	//console.log(sorted_vulnerabilities);

   $('#dependency-issues').html(sorted_vulnerabilities);
				
}

function changeSecText(){
	if($('.security-holder').text() == "Show Security Issues"){
		$('.security-holder').text("Hide Security Issues");
	}
	else {
		$('.security-holder').text("Show Security Issues");
	}
}

function changeDepText(){
	if($('.dependency-holder').text() == "Show Dependancy Issues"){
		$('.dependency-holder').text("Hide Dependancy Issues");
	}
	else {
		$('.dependency-holder').text("Show Dependancy Issues");
	}
}

$(document).ready(function(){
	console.log("Hi");
	loadXML();
});