window.onload = function() {
	function replaceTemplateOccurence(index, value) {
		document.getElementById('results-description').innerHTML = document.getElementById('results-description').innerHTML.replace('{' + index.toString() + '}', value);
	}

	document.getElementById('next').onclick = function() {
		document.getElementById('results-description').innerHTML = "The estimated annual cost of Alzheimer's Disease for your family is {1}. You {2} eligible for Medicaid, and for more information on what expenses Medicaid will cover and eligibility in general, you should visit <a target='_blank' href='https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/'>this link</a>. You {3} eligible for Medicare, and for more information on what expenses Medicare will cover, you should visit <a target='_blank' href='https://www.medicare.gov/Pubs/pdf/11579-medicare-costs.pdf'>this link</a>. {4} {5} be paid for by SSI annually. {6}";

		var flag = false;

		var annualSSIBenefits = 0;	
		var assets = parseFloat(document.getElementById('assets').value);
		if(assets <= 3000) {
			if(document.getElementById('their-absence-no').checked) {
				if(document.getElementById('their-status-1').checked || document.getElementById('their-status-3').checked) {
					var maybe_qualified_alien = document.getElementById('their-status-3').checked;
					
					if(document.getElementById('their-confinement-no').checked) {
						var certainly_qualified = parseFloat(document.getElementById('patient-age').value || 65) >= 65;
						var coupleIncome = parseFloat(document.getElementById('your-income').value || 0);
						annualSSIBenefits = Math.max(0, 14100 - coupleIncome);
						if(maybe_qualified_alien || !certainly_qualified) {
							replaceTemplateOccurence(5, "might");
							flag = true;
							var reason = "(Although you ";
							if(maybe_qualified_alien && certainly_qualified) {
								reason += "are not a U.S. citizen, ";
							}
							else if(!maybe_qualified_alien && !certainly_qualified) {
								reason += "are not 65 or older, ";
							}
							else if(maybe_qualified_alien && !certainly_qualified) {
								reason += "are not a U.S. citizen and are not 65 or older, ";
							}
							replaceTemplateOccurence(6, reason + "you may still qualify for SSI. Complete <a target='_blank' href='https://ssabest.benefits.gov'>this questionnaire</a> to find out if you qualify).");
						}
					}
				}
			}
		}
		net_cost = Math.max(parseFloat(document.getElementById('expenditures').value || 0) - annualSSIBenefits, 0);
		replaceTemplateOccurence(1, '$' + net_cost.toString());
		if(annualSSIBenefits > 0) { // medicaid
			replaceTemplateOccurence(2, 'are');
			replaceTemplateOccurence(4, '$' + annualSSIBenefits.toString());
			if(!flag) {
				replaceTemplateOccurence(5, "will");
				replaceTemplateOccurence(6, "");
			}
		}
		else {
			replaceTemplateOccurence(2, 'may be');
			replaceTemplateOccurence(4, '$0');
			if(!flag) {
				replaceTemplateOccurence(5, "will");
				replaceTemplateOccurence(6, "");
			}
		}

		if(parseInt(document.getElementById('patient-age')) >= 65) { // medicare
			replaceTemplateOccurence(3, 'are');
		}
		else {
			replaceTemplateOccurence(3, 'are');
		}
		document.getElementById('questions').classList.remove('active');
		document.getElementById('results').classList.add('active');
		//https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	};

	/*document.getElementById('back').onclick = function() {
		document.getElementById('questions').classList.add('active');
		document.getElementById('results').classList.remove('active');
	};

	document.getElementById('learn-more').onclick = function() {
		document.getElementById('moreinfo').classList.add('active');
		document.getElementById('results').classList.remove('active');
	};

	document.getElementById('back-to-results').onclick = function() {
		document.getElementById('moreinfo').classList.remove('active');
		document.getElementById('results').classList.add('active');
	};*/

	document.getElementById('prev').onclick = function() {
		var lis = [...document.getElementById('questionnaire').children];
		var active = [...document.getElementsByClassName('active')][0]
		var idx = lis.indexOf(active);
		active.classList.remove('active');
		lis[Math.max(0, idx - 1)].classList.add('active');
	};

	document.getElementById('next').onclick = function() {
		var lis = [...document.getElementById('questionnaire').children];
		var active = [...document.getElementsByClassName('active')][0]
		var idx = lis.indexOf(active);
		active.classList.remove('active');
		lis[Math.min(lis.length - 1, idx + 1)].classList.add('active');
	};
};
