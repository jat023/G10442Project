var findSecBugsxml;
var dependenciesXml;

function loadXML(){
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
			findSecBugsxml = xmlhttp.responseText; //Can do automatically!
			//console.log(findSecBugsxml);
		}
	};
	xmlhttp.open("GET","xml/testMine.xml",true);
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
	//var opener = new XMLHttpRequest();
	//var test2 = opener.open("GET",'xml/testMine.xml',false);
	//console.log(test2);
}


//Currently just logging stuff
function showfindSecBugsXML(xml){
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(xml, 'text/xml');
	var bugs = xmlDoc.getElementsByTagName("BugInstance")
	for (var bug of bugs){
		//console.log(bugs[x]);//.getAttribute("type"));
		if (bug.getAttribute("type") != "NM_CLASS_NAMING_CONVENTION"){
			var childrenNodes = bug.childNodes;
			//console.log(childrenNodes);
			var justDoIt = true;
			for (var check of childrenNodes){
				if (check.nodeName == "Class"){
					if(check.getAttribute("classname").indexOf("android.") > -1){
						justDoIt = false;					
					}
				}
			}
			if (justDoIt){
				for (var check of childrenNodes){
					if (check.nodeName == "LongMessage"){
						console.log(check.textContent);
					}
				}
			}			

		}
		
	}
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
				$("#dependency-issues").append("<div class='file-name'> Analysis of " + file + "</div>");
				console.log(node.textContent);
			}
			if (node.nodeName == "vulnerabilities"){
				var vulnerabilities = node.childNodes;
				console.log(vulnerabilities);
				var vulnerabilityNum = 0;
				for (var vulnerability of vulnerabilities){
					var attributes = vulnerability.childNodes;
					console.log(attributes.length);
					if (attributes.length > 0){
						$(".file-name").append("<div style='cursor:pointer; border-radius: 5px; padding: 3px; margin: 3px;' class='vulnerability vulnerability-"+ vulnerabilityNum + "' data-toggle='collapse' data-target='#vulnerability-description-"+vulnerabilityNum +"'></div>");
						for (var attribute of attributes){
							if (attribute.nodeName == "name"){
								$('.vulnerability-' + vulnerabilityNum).append("<span class='vulnerability-codename-" + vulnerabilityNum+"'>(" + attribute.textContent + ") </span>");
							}

							if (attribute.nodeName == "cwe"){
								console.log(file);
								$('.vulnerability-' + vulnerabilityNum).append("<div class='vulnerability-name-" + vulnerabilityNum + "'>" + attribute.textContent + "</div>");
								if ($('.vulnerability-codename-'+ vulnerabilityNum).length){
									var vulnerability_codename = $('.vulnerability-codename-'+ vulnerabilityNum).text();
									console.log(vulnerability_codename);
									$('.vulnerability-codename-'+ vulnerabilityNum).remove();
									$('.vulnerability-name-' + vulnerabilityNum).append(" " + vulnerability_codename);
									
								}
								//console.log(attribute.textContent);
							}
							if (attribute.nodeName == "severity"){
								$('.vulnerability-' + vulnerabilityNum).append("<span class='vulnerability-severity-" + vulnerabilityNum + "'>" + attribute.textContent + "</span>");
								//console.log(attribute.textContent);
								if (attribute.textContent == "Low"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ffb2b2');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 1);

								}
								if (attribute.textContent == "Medium"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff7f7f');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 2);

								}
								if (attribute.textContent == "High"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff4c4c');
									$('.vulnerability-' + vulnerabilityNum).attr("data-severity", 3);

								}
								if (attribute.textContent == "Highest"){
									$('.vulnerability-' + vulnerabilityNum).css('background-color', '#ff1919');
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
											$('.vulnerability-references-' + vulnerabilityNum).append("<a href='" + attr.textContent + "'>[" + numReferences + "]</a>");
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
	  console.log(contentA);
	  console.log(contentB);
      return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
   });
  	console.log(sorted_vulnerabilities);

   $('#dependency-issues').html(sorted_vulnerabilities);
				
}

$(document).ready(function(){
	loadXML();
});